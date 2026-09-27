/**
 * Post-Selection Lifecycle Manager
 * Handles disbursements, progress reporting, and post-award events for NFST & NOS.
 */
class PostSelectionLifecycle {
  constructor(db, auditLogger) {
    this.db = db;
    this.audit = auditLogger;
  }

  // ==========================================
  // NFST POST-SELECTION LOGIC
  // ==========================================

  checkJoiningDeadlineNFST(application) {
    // 1 month from provisional award
    const awardDate = new Date(application.provisionalAwardDate);
    const deadline = new Date(awardDate.setMonth(awardDate.getMonth() + 1));
    const now = new Date();

    if (now > deadline && !application.joiningReportSubmitted) {
      application.status = 'CANCELLED';
      application.cancellationReason = 'JOINING_REPORT_TIMEOUT';
      
      this.audit.log(
        "NFST_JOINING_TIMEOUT",
        "system",
        { applicationId: application.id, deadline, reason: 'Failed to join within 1 month.' }
      );
      
      // Emit event for AllocationService to promote the next person on the waitlist
      return { action: 'TRIGGER_WAITLIST_PROMOTION', bucket: application.bucket };
    }
    return { action: 'NONE' };
  }

  verifyQuarterlyContinuationNFST(application, submissionDate) {
    // Exact due dates: 10 Jul / 10 Oct / 10 Jan / 10 Apr
    const allowedDates = [
      { month: 6, day: 10 }, // July (0-indexed)
      { month: 9, day: 10 }, // Oct
      { month: 0, day: 10 }, // Jan
      { month: 3, day: 10 }  // Apr
    ];
    
    // In a real implementation, we would validate if the submissionDate aligns with the nearest allowedDate
    // For this prototype, we record the submission and link HRA.
    
    application.latestContinuation = submissionDate;
    application.hraEligible = application.residesInHostel === false; 
    
    this.audit.log("NFST_CONTINUATION_APPROVED", "institute_nodal_officer", { applicationId: application.id, hraEligible: application.hraEligible });
  }

  checkYearlyProgressNFST(application, monthsElapsed) {
    if (monthsElapsed % 12 === 0 && !application.yearlyProgressReportUploaded) {
      return { blocked: true, reason: 'YEARLY_PROGRESS_REPORT_PENDING' };
    }
    return { blocked: false };
  }

  processFinalQuarterPaymentNFST(application) {
    if (application.isFinalQuarter && !application.thesisUploaded) {
      return { paymentReleased: false, error: 'THESIS_UPLOAD_REQUIRED' };
    }
    return { paymentReleased: true };
  }

  upgradeMPhilToPhdNFST(application) {
    // Section 5.4.2 - Max 5 years total
    const totalYearsUsed = application.mphilYearsUsed || 2;
    if (totalYearsUsed >= 5) {
      throw new Error("MAX_DURATION_EXCEEDED");
    }
    application.programType = 'PHD';
    application.remainingYears = 5 - totalYearsUsed;
    
    this.audit.log("NFST_UPGRADE_TO_PHD", "system", { applicationId: application.id, remainingYears: application.remainingYears });
  }

  initiateTransferNFST(application, newInstituteId) {
    application.status = 'TRANSFER_PENDING';
    application.transferDetails = {
      fromInstitute: application.instituteId,
      toInstitute: newInstituteId,
      approvedByOld: false,
      approvedByNew: false
    };
    this.audit.log("NFST_TRANSFER_INITIATED", "applicant", { applicationId: application.id, toInstitute: newInstituteId });
  }

  processDiscontinuationNFST(application, reason, refundCalculated) {
    application.status = 'DISCONTINUED';
    application.refundLiability = refundCalculated; // Only calculate if discontinuation is due to fraud/dropout violating bonds
    
    this.audit.log("NFST_DISCONTINUED", "ministry_admin", { applicationId: application.id, reason, liability: refundCalculated });
  }


  // ==========================================
  // NOS POST-SELECTION LOGIC
  // ==========================================

  checkJoiningDeadlineNOS(application) {
    // Joining abroad deadline tracking
    const awardDate = new Date(application.provisionalAwardDate);
    const deadline = new Date(awardDate.setMonth(awardDate.getMonth() + 6)); // Usually 6 months for NOS
    const now = new Date();

    if (now > deadline && !application.joiningReportSubmitted) {
      application.status = 'CANCELLED';
      application.cancellationReason = 'JOINING_ABROAD_TIMEOUT';
      
      this.audit.log("NOS_JOINING_TIMEOUT", "system", { applicationId: application.id });
    }
  }

  confirmProvisionalNOS(application, checklist) {
    const requiredDocs = ['VISA_COPY', 'FLIGHT_TICKET', 'FINAL_OFFER_LETTER', 'HEALTH_INSURANCE'];
    const missing = requiredDocs.filter(doc => !checklist.includes(doc));
    
    if (missing.length > 0) {
      return { status: 'DEFECTIVE', missing };
    }
    
    application.status = 'AWARD_CONFIRMED';
    this.audit.log("NOS_AWARD_CONFIRMED", "scrutiny_officer", { applicationId: application.id });
    return { status: 'AWARD_CONFIRMED' };
  }

  checkSixMonthlyProgressNOS(application, monthsElapsed) {
    if (monthsElapsed % 6 === 0 && !application.sixMonthProgressUploaded) {
      return { blocked: true, reason: 'SIX_MONTH_PROGRESS_REPORT_PENDING' };
    }
    return { blocked: false };
  }

  cancelOnEarlyReturnNOS(application, returnDate) {
    const courseEndDate = new Date(application.courseEndDate);
    if (new Date(returnDate) < courseEndDate) {
      application.status = 'CANCELLED_EARLY_RETURN';
      this.audit.log("NOS_EARLY_RETURN_CANCELLATION", "system", { applicationId: application.id, returnDate });
    }
  }
}

module.exports = PostSelectionLifecycle;

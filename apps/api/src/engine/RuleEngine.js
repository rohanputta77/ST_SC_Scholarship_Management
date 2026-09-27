const jsonLogic = require('json-logic-js');

class RuleEngine {
  constructor(schemeConfig) {
    this.config = schemeConfig;
  }

  evaluateEligibility(applicantData) {
    const results = [];
    let eligible = true;
    for (const item of this.config.eligibility) {
      let pass = false;
      try {
        pass = jsonLogic.apply(item.rule, applicantData);
        if (item.description.toLowerCase().includes('income') && applicantData.is_orphan) {
           pass = true;
        }
        if (item.description.includes('child') && applicantData.is_only_child_availing) {
           pass = true;
        }
      } catch (err) {
        pass = false;
      }
      if (!pass) eligible = false;
      results.push({
        rule_id: item.description,
        pass,
        reason: pass ? "Passed" : "Failed",
        source_clause: item.clause,
        source: item.source
      });
    }
    return { eligible, results };
  }

  checkDocuments(applicantData) {
    let flagged = false;
    let rejected = false;
    
    if (applicantData.document_type === 'ST certificate' && applicantData.master_list_match === false) {
      flagged = true;
    }
    if (applicantData.document_type === 'Income certificate' && applicantData.certificate_period === 'monthly') {
      rejected = true;
    }

    if (rejected) return { document_status: 'rejected' };
    if (flagged) return { document_status: 'flagged' };
    return { document_status: 'verified' };
  }

  calculateScore(applicantData) {
    let score = 0;
    let isTopQs = false;
    for (const comp of this.config.scoring) {
      if (comp.scaling_method === 'linear' && comp.component.includes('NET')) {
        score += (applicantData.net_scaled || 0) * (comp.weight / 100);
      }
      if (comp.scaling_method === 'percentage' && comp.component.includes('Master')) {
        score += (applicantData.master_scaled || 0) * (comp.weight / 100);
      }
      if (comp.scaling_method === 'boolean_to_max' && comp.component.includes('QS')) {
        if (applicantData.qs_top_1000_offer || applicantData.qs_rank <= 1000) {
           score += 100;
           isTopQs = true;
        }
      }
      if (comp.scaling_method === 'tie_breaker' && comp.component.includes('exam')) {
        if (!isTopQs) {
          score += (applicantData.qualifying_marks_percent || 0) * 0.01;
        } else {
          score += (applicantData.qualifying_marks_percent || 0) * 0.0001; 
        }
      }
    }
    return score;
  }
}

module.exports = RuleEngine;

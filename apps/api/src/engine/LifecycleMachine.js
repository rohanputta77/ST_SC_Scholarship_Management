const { createMachine } = require('xstate');

const lifecycleMachine = createMachine({
  id: 'applicationLifecycle',
  initial: 'draft',
  states: {
    draft: {
      on: { SUBMIT: 'submitted' }
    },
    submitted: {
      on: {
        AI_CHECK_PASS: 'institute_verification',
        AI_CHECK_FAIL: 'defective'
      }
    },
    institute_verification: {
      on: {
        APPROVE: 'ministry_verification',
        MARK_DEFECTIVE: 'defective',
        REJECT: 'closed'
      }
    },
    defective: {
      on: {
        RESUBMIT: 'institute_verification'
      }
    },
    ministry_verification: {
      on: {
        APPROVE: 'provisional_merit',
        MARK_DEFECTIVE: 'defective',
        REJECT: 'closed'
      }
    },
    provisional_merit: {
      on: {
        ISSUE_AWARD: 'provisional_award'
      }
    },
    provisional_award: {
      on: {
        CONFIRM: 'joined'
      }
    },
    joined: {
      on: {
        ACTIVATE: 'active'
      }
    },
    active: {
      on: {
        COMPLETE: 'closed',
        CANCEL: 'cancelled'
      }
    },
    closed: {
      type: 'final'
    },
    cancelled: {
      type: 'final'
    }
  }
});

module.exports = lifecycleMachine;

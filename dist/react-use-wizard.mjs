import { createContext, useContext, memo, useState, useRef, Children, useCallback, useMemo, cloneElement, createElement } from 'react';

const WizardContext = /*#__PURE__*/createContext(null);

if (process.env.NODE_ENV !== "production") {
  WizardContext.displayName = 'WizardContext';
}

const useWizard = () => {
  const context = useContext(WizardContext);

  if (!context && process.env.NODE_ENV !== "production") {
    throw Error('Wrap your step with `Wizard`');
  } else {
    return context;
  }
};

/**
 * Log messages in the console with a corresponding urgency
 *
 * @param level The urgency of the message
 * @param message The message to log in the console
 */
const log = (level, message) => {
  if (process.env.NODE_ENV !== "production") {
    const packageName = '[react-use-wizard]';

    switch (level) {
      case 'warn':
        console.warn(packageName + " " + message);
        break;

      case 'error':
        console.error(packageName + " " + message);
        break;

      default:
        console.log(packageName + " " + message);
    }
  }
};

const Wizard = /*#__PURE__*/memo(({
  header,
  footer,
  children,
  onStepChange,
  wrapper: Wrapper,
  startIndex = 0
}) => {
  const [activeStep, setActiveStep] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(false);
  const hasNextStep = useRef(true);
  const hasPreviousStep = useRef(false);
  const nextStepHandler = useRef(() => {});
  const stepCount = Children.toArray(children).length;
  hasNextStep.current = activeStep < stepCount - 1;
  hasPreviousStep.current = activeStep > 0;
  const goToNextStep = useCallback(() => {
    if (hasNextStep.current) {
      const newActiveStepIndex = activeStep + 1;
      setActiveStep(newActiveStepIndex);
      onStepChange == null ? void 0 : onStepChange(newActiveStepIndex);
    }
  }, [activeStep, onStepChange]);
  const goToPreviousStep = useCallback(() => {
    if (hasPreviousStep.current) {
      nextStepHandler.current = null;
      const newActiveStepIndex = activeStep - 1;
      setActiveStep(newActiveStepIndex);
      onStepChange == null ? void 0 : onStepChange(newActiveStepIndex);
    }
  }, [activeStep, onStepChange]);
  const goToStep = useCallback(stepIndex => {
    if (stepIndex >= 0 && stepIndex < stepCount) {
      nextStepHandler.current = null;
      setActiveStep(stepIndex);
      onStepChange == null ? void 0 : onStepChange(stepIndex);
    } else {
      if (process.env.NODE_ENV !== "production") {
        log('warn', ["Invalid step index [" + stepIndex + "] passed to 'goToStep'. ", "Ensure the given stepIndex is not out of boundaries."].join(''));
      }
    }
  }, [stepCount, onStepChange]); // Callback to attach the step handler

  const handleStep = useRef(handler => {
    nextStepHandler.current = handler;
  });
  const doNextStep = useCallback(async () => {
    if (hasNextStep.current && nextStepHandler.current) {
      try {
        setIsLoading(true);
        await nextStepHandler.current();
        setIsLoading(false);
        nextStepHandler.current = null;
        goToNextStep();
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    } else {
      goToNextStep();
    }
  }, [goToNextStep]);
  const wizardValue = useMemo(() => ({
    nextStep: doNextStep,
    previousStep: goToPreviousStep,
    handleStep: handleStep.current,
    isLoading,
    activeStep,
    stepCount,
    isFirstStep: !hasPreviousStep.current,
    isLastStep: !hasNextStep.current,
    goToStep
  }), [doNextStep, goToPreviousStep, isLoading, activeStep, stepCount, goToStep]);
  const activeStepContent = useMemo(() => {
    const reactChildren = Children.toArray(children);

    if (process.env.NODE_ENV !== "production") {
      // No steps passed
      if (reactChildren.length === 0) {
        log('warn', 'Make sure to pass your steps as children in your <Wizard>');
      } // The passed start index is invalid


      if (activeStep > reactChildren.length) {
        log('warn', 'An invalid startIndex is passed to <Wizard>');
      }
    }

    return reactChildren[activeStep];
  }, [activeStep, children]);
  const enhancedActiveStepContent = useMemo(() => Wrapper ? cloneElement(Wrapper, {
    children: activeStepContent
  }) : activeStepContent, [Wrapper, activeStepContent]);
  return createElement(WizardContext.Provider, {
    value: wizardValue
  }, header ? header({
    activeStep: wizardValue.activeStep,
    stepCount: wizardValue.stepCount
  }) : null, enhancedActiveStepContent, footer ? footer({
    activeStep: wizardValue.activeStep,
    stepCount: wizardValue.stepCount
  }) : null);
});

export { Wizard, useWizard };
//# sourceMappingURL=react-use-wizard.mjs.map

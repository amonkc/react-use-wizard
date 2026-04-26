// src/useWizard.ts
import * as React2 from "react";

// src/wizardContext.ts
import * as React from "react";
var WizardContext = React.createContext(null);
if (__DEV__) {
  WizardContext.displayName = "WizardContext";
}
var wizardContext_default = WizardContext;

// src/useWizard.ts
var useWizard = () => {
  const context = React2.useContext(wizardContext_default);
  if (!context && __DEV__) {
    throw Error("Wrap your step with `Wizard`");
  } else {
    return context;
  }
};
var useWizard_default = useWizard;

// src/wizard.tsx
import * as React3 from "react";

// src/logger.ts
var log = (level, message) => {
  if (__DEV__) {
    const packageName = "[react-use-wizard]";
    switch (level) {
      case "warn":
        console.warn(`${packageName} ${message}`);
        break;
      case "error":
        console.error(`${packageName} ${message}`);
        break;
      default:
        console.log(`${packageName} ${message}`);
    }
  }
};

// src/wizard.tsx
var Wizard = React3.memo(
  ({
    header,
    footer,
    children,
    onStepChange,
    wrapper: Wrapper,
    startIndex = 0
  }) => {
    const [activeStep, setActiveStep] = React3.useState(startIndex);
    const [isLoading, setIsLoading] = React3.useState(false);
    const hasNextStep = React3.useRef(true);
    const hasPreviousStep = React3.useRef(false);
    const nextStepHandler = React3.useRef(() => {
    });
    const stepCount = React3.Children.toArray(children).length;
    hasNextStep.current = activeStep < stepCount - 1;
    hasPreviousStep.current = activeStep > 0;
    const goToNextStep = React3.useCallback(() => {
      if (hasNextStep.current) {
        const newActiveStepIndex = activeStep + 1;
        setActiveStep(newActiveStepIndex);
        onStepChange && onStepChange(newActiveStepIndex);
      }
    }, [activeStep, onStepChange]);
    const goToPreviousStep = React3.useCallback(() => {
      if (hasPreviousStep.current) {
        nextStepHandler.current = null;
        const newActiveStepIndex = activeStep - 1;
        setActiveStep(newActiveStepIndex);
        onStepChange && onStepChange(newActiveStepIndex);
      }
    }, [activeStep, onStepChange]);
    const goToStep = React3.useCallback(
      (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < stepCount) {
          nextStepHandler.current = null;
          setActiveStep(stepIndex);
          onStepChange && onStepChange(stepIndex);
        } else {
          if (__DEV__) {
            log(
              "warn",
              [
                `Invalid step index [${stepIndex}] passed to 'goToStep'. `,
                `Ensure the given stepIndex is not out of boundaries.`
              ].join("")
            );
          }
        }
      },
      [stepCount, onStepChange]
    );
    const handleStep = React3.useRef((handler) => {
      nextStepHandler.current = handler;
    });
    const doNextStep = React3.useCallback(async () => {
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
    const wizardValue = React3.useMemo(
      () => ({
        nextStep: doNextStep,
        previousStep: goToPreviousStep,
        handleStep: handleStep.current,
        isLoading,
        activeStep,
        stepCount,
        isFirstStep: !hasPreviousStep.current,
        isLastStep: !hasNextStep.current,
        goToStep
      }),
      [
        doNextStep,
        goToPreviousStep,
        isLoading,
        activeStep,
        stepCount,
        goToStep
      ]
    );
    const activeStepContent = React3.useMemo(() => {
      const reactChildren = React3.Children.toArray(children);
      if (__DEV__) {
        if (reactChildren.length === 0) {
          log(
            "warn",
            "Make sure to pass your steps as children in your <Wizard>"
          );
        }
        if (activeStep > reactChildren.length) {
          log("warn", "An invalid startIndex is passed to <Wizard>");
        }
      }
      return reactChildren[activeStep];
    }, [activeStep, children]);
    const enhancedActiveStepContent = React3.useMemo(
      () => Wrapper ? React3.cloneElement(Wrapper, { children: activeStepContent }) : activeStepContent,
      [Wrapper, activeStepContent]
    );
    return /* @__PURE__ */ React3.createElement(wizardContext_default.Provider, { value: wizardValue }, header ? header(wizardValue) : null, enhancedActiveStepContent, footer ? footer(wizardValue) : null);
  }
);
var wizard_default = Wizard;
export {
  wizard_default as Wizard,
  useWizard_default as useWizard
};

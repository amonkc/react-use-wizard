import * as React from 'react';

import * as logger from './logger';
import { Handler, WizardProps } from './types';
import WizardContext from './wizardContext';

const Wizard: React.FC<React.PropsWithChildren<WizardProps>> = React.memo(
  ({
    header,
    footer,
    children,
    onStepChange,
    wrapper: Wrapper,
    startIndex = 0,
  }) => {
    const [activeStep, setActiveStep] = React.useState(startIndex);
    const [isLoading, setIsLoading] = React.useState(false);
    const hasNextStep = React.useRef(true);
    const hasPreviousStep = React.useRef(false);
    const nextStepHandler = React.useRef<Handler>(() => {});
    const stepCount = React.Children.toArray(children).length;

    hasNextStep.current = activeStep < stepCount - 1;
    hasPreviousStep.current = activeStep > 0;

    const goToNextStep = React.useCallback(() => {
      if (hasNextStep.current) {
        const newActiveStepIndex = activeStep + 1;

        setActiveStep(newActiveStepIndex);
        onStepChange && onStepChange(newActiveStepIndex);
      }
    }, [activeStep, onStepChange]);

    const goToPreviousStep = React.useCallback(() => {
      if (hasPreviousStep.current) {
        nextStepHandler.current = null;
        const newActiveStepIndex = activeStep - 1;

        setActiveStep(newActiveStepIndex);
        onStepChange && onStepChange(newActiveStepIndex);
      }
    }, [activeStep, onStepChange]);

    const goToStep = React.useCallback(
      (stepIndex: number) => {
        if (stepIndex >= 0 && stepIndex < stepCount) {
          nextStepHandler.current = null;
          setActiveStep(stepIndex);
          onStepChange && onStepChange(stepIndex);
        } else {
          if (__DEV__) {
            logger.log(
              'warn',
              [
                `Invalid step index [${stepIndex}] passed to 'goToStep'. `,
                `Ensure the given stepIndex is not out of boundaries.`,
              ].join(''),
            );
          }
        }
      },
      [stepCount, onStepChange],
    );

    // Callback to attach the step handler
    const handleStep = React.useRef((handler: Handler) => {
      nextStepHandler.current = handler;
    });

    const doNextStep = React.useCallback(async () => {
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

    const wizardValue = React.useMemo(
      () => ({
        nextStep: doNextStep,
        previousStep: goToPreviousStep,
        handleStep: handleStep.current,
        isLoading,
        activeStep,
        stepCount,
        isFirstStep: !hasPreviousStep.current,
        isLastStep: !hasNextStep.current,
        goToStep,
      }),
      [
        doNextStep,
        goToPreviousStep,
        isLoading,
        activeStep,
        stepCount,
        goToStep,
      ],
    );

    const activeStepContent = React.useMemo(() => {
      const reactChildren = React.Children.toArray(children);

      if (__DEV__) {
        // No steps passed
        if (reactChildren.length === 0) {
          logger.log(
            'warn',
            'Make sure to pass your steps as children in your <Wizard>',
          );
        }
        // The passed start index is invalid
        if (activeStep > reactChildren.length) {
          logger.log('warn', 'An invalid startIndex is passed to <Wizard>');
        }
      }

      return reactChildren[activeStep];
    }, [activeStep, children]);

    const enhancedActiveStepContent = React.useMemo(
      () =>
        Wrapper
          ? React.cloneElement(Wrapper, { children: activeStepContent })
          : activeStepContent,
      [Wrapper, activeStepContent],
    );

    return (
      <WizardContext.Provider value={wizardValue}>
        {header
          ? header({
              activeStep: wizardValue.activeStep,
              stepCount: wizardValue.stepCount,
            })
          : null}
        {enhancedActiveStepContent}
        {footer
          ? footer({
              activeStep: wizardValue.activeStep,
              stepCount: wizardValue.stepCount,
            })
          : null}
      </WizardContext.Provider>
    );
  },
);

export default Wizard;

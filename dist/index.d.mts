import * as React$1 from 'react';

type Handler$1 = (() => Promise<void>) | (() => void) | null;
type WizardProps$1 = {
    /** Optional header that is shown above the active step */
    header?: (wizardValues: WizardValues$1) => React.ReactNode;
    /** Optional footer that is shown below the active step */
    footer?: (wizardValues: WizardValues$1) => React.ReactNode;
    /** Optional start index @default 0 */
    startIndex?: number;
    /**
     * Optional wrapper that is exclusively wrapped around the active step component. It is not wrapped around the `header` and `footer`
     * @example With `framer-motion` - `<AnimatePresence />`
     * ```jsx
     * <Wizard wrapper={<AnimatePresence exitBeforeEnter />}>
     * ...
     * </Wizard>
     * ```
     */
    wrapper?: React.ReactElement;
    /** Callback that will be invoked with the new step index when the wizard changes steps */
    onStepChange?: (stepIndex: number) => void;
};
type WizardValues$1 = {
    /**
     * Go to the next step
     */
    nextStep: () => Promise<void>;
    /**
     * Go to the previous step
     */
    previousStep: () => void;
    /**
     * Go to the given step index
     * @param stepIndex The step index, starts at 0
     */
    goToStep: (stepIndex: number) => void;
    /**
     * Attach a callback that will be called when calling `nextStep()`
     * @param handler Can be either sync or async
     */
    handleStep: (handler: Handler$1) => void;
    /**
     * Indicate the current state of the handler
     *
     * Will reflect the handler promise state: will be `true` if the handler promise is pending and
     * `false` when the handler is either fulfilled or rejected
     */
    isLoading: boolean;
    /** The current active step of the wizard */
    activeStep: number;
    /** The total number of steps of the wizard */
    stepCount: number;
    /** Indicate if the current step is the first step (aka no previous step) */
    isFirstStep: boolean;
    /** Indicate if the current step is the last step (aka no next step) */
    isLastStep: boolean;
};

declare const useWizard: () => WizardValues$1;

declare const Wizard: React$1.FC<React$1.PropsWithChildren<WizardProps$1>>;

type WizardProps = WizardProps$1;
type WizardValues = WizardValues$1;
type Handler = Handler$1;

export { type Handler, Wizard, type WizardProps, type WizardValues, useWizard };

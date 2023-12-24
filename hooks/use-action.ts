import { useState, useCallback } from "react";

import { ActionState, FieldErrors } from "@/lib/create-safe-action";

type Action<TInput, TOutput> = (data: TInput) => Promise<ActionState<TInput, TOutput>>;

interface UseActionOptions<TOutput> {
    onSuccess?: (data:TOutput) => void;
    onError?: (error: string) => void;
    OnComplete?: () => void;
};

export const useAction = <TInput, TOutput> (
    action: Action<TInput, TOutput>,
    options: UseActionOptions<TOutput> ={}
) => {
    const [fieldErrors, setFielErrors] = useState<FieldErrors<TInput> | undefined>(
        undefined
    );
    const [error, setError] = useState<string | undefined>(undefined);
    const [data, setData] = useState<TOutput | undefined>(undefined);
    const [isLoading, SetIsLoading] = useState<boolean>(false);

    const execute = useCallback(
        async (input: TInput) => {
            SetIsLoading(true);

            try{
                const result = await action(input);

                if (!result) {
                    return;
                }

                if (result.fieldErrors) {
                    setFielErrors(result.fieldErrors);
                }

                if (result.error) {
                    setError(result.error);
                    options.onError?.(result.error);
                }

                if (result.data) {
                    setData(result.data);
                    options.onSuccess?.(result.data);
                }
            } finally {
                SetIsLoading(false);
                options.OnComplete?.();
            }
        },
        [action, options]
    );
    return {
        execute,
        fieldErrors,
        error,
        data,
        isLoading,
    };
};
import { DeviceMethodParams } from 'azure-iothub';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { Ux4iotContext } from './Ux4iotContext';
import { GrantErrorCallback } from './types';
import { IoTHubResponse } from './ux4iot-shared';

type UseDirectMethodOutput = (
	payload: Record<string, unknown>
) => Promise<IoTHubResponse | void>;

type HookOptions = {
	onGrantError?: GrantErrorCallback;
};

export const useDirectMethod = (
	deviceId: string,
	methodName: string,
	options: HookOptions = {}
): UseDirectMethodOutput => {
	const { onGrantError } = options;
	const ux4iot = useContext(Ux4iotContext);
	const onGrantErrorRef = useRef(onGrantError);

	useEffect(() => {
		onGrantErrorRef.current = onGrantError;
	}, [onGrantError]);

	const directMethod = useCallback(
		async (
			deviceId: string,
			options: DeviceMethodParams
		): Promise<IoTHubResponse | void> => {
			return await ux4iot?.invokeDirectMethod(
				deviceId,
				options,
				onGrantErrorRef.current
			);
		},
		[ux4iot]
	);

	return payload => directMethod(deviceId, { methodName, payload });
};

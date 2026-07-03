// src/lib/useAlert.js

import { toastController } from '@ionic/vue';
import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';

export const useAlert = () => {

    // const toastAlert = async (
    //     type = 'info',
    //     message = 'Message Not Found',
    //     duration = 'short',
    //     position = 'bottom'
    // ) => {
    //
    //     if (!message) return;
    //
    //     let prefix = '';
    //     switch (type) {
    //         case 'success':
    //             prefix = '✅ ';
    //             break;
    //         case 'error':
    //             prefix = '❌ ';
    //             break;
    //         case 'warning':
    //             prefix = '⚠️ ';
    //             break;
    //         case 'info':
    //         default:
    //             prefix = 'ℹ️ ';
    //     }
    //
    //     // Web fallback
    //     if (Capacitor.getPlatform() === 'web') {
    //         alert(prefix + message);
    //         return;
    //     }
    //
    //     // Mobile toast
    //     await Toast.show({
    //         text: prefix + message,
    //         duration: duration.toUpperCase(), // 'SHORT' or 'LONG'
    //         position,
    //     });
    // };

    const toastAlert = async (
        type = 'info',
        message = 'Message Not Found',
        duration = 2000, // milliseconds
        position = 'bottom'
    ) => {
        if (!message) return;

        let color = 'primary';
        let prefix = '';

        switch (type) {
            case 'success':
                color = 'success';
                prefix = '';
                break;
            case 'error':
                color = 'danger';
                prefix = '';
                break;
            case 'warning':
                color = 'warning';
                prefix = '';
                break;
            case 2000:
                color = 'success';
                prefix = '';
                break;
            case 3000:
                color = 'warning';
                prefix = '';
                break;
            case 4000:
                color = 'info';
                prefix = '';
                break;
            case 5000:
            case 6000:
                color = 'danger';
                prefix = '';
                break;

            case 'info':
                color = 'info';
                prefix = '';
                break
            default:
                color = 'primary';
                prefix = ' ';
        }

        const toast = await toastController.create({
            message: prefix + message,
            duration: duration,
            position: position,
            color: color,
            cssClass: 'custom-toast',
        });

        await toast.present();
    };

    const showAlert = async (title = 'Alert', message = 'This is an alert') => {
        if (Capacitor.getPlatform() === 'web') {
            // window.alert(`${title}\n\n${message}`);
            return;
        }

        await Dialog.alert({
            title,
            message,
        });
    };

    const showConfirm = async (title = 'Confirm', message = 'Are you sure?') => {

        if (Capacitor.getPlatform() === 'web') {
            // return window.confirm(`${title}\n\n${message}`);
        }

        const { value } = await Dialog.confirm({
            title,
            message,
        });

        return value; // true if OK, false if Cancel
    };


    const showPrompt = async (
        title = 'Prompt',
        message = 'Please enter a value',
        inputType = 'text'
    ) => {

        if (Capacitor.getPlatform() === 'web') {
            const result = window.prompt(`${title}\n\n${message}`);
            return result; // null if cancelled
        }

        const { value } = await Dialog.prompt({
            title,
            message,
            inputType,
            okButtonTitle: 'OK',
            cancelButtonTitle: 'Cancel'
        });

        return value; // null if cancelled
    };


    return {
        toastAlert,
        showAlert,
        showConfirm,
        showPrompt,
    };
};

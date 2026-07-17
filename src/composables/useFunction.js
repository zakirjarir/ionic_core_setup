import { ref } from 'vue'
import api from "@/services/api/index.js"
import { useStore } from './useStore.js';
import { useAlert } from './useAlert.js';
import { useCP } from './useCP.js';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'


import i18n from '@/i18n'


export const useFunction = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL

    const {toastAlert,showConfirm} = useAlert()

    const t = i18n.global.t

    const store = useStore()
    const CP = useCP()


    const LFA = ($path) => {
        if (!$path) {return null}
        // base64 dataUrl হলে সরাসরি return করো
        if (typeof $path === 'string' && $path.startsWith('data:')) {
            return $path
        }
        return `${store.mainUrl}/${$path}`
    }

    const getDateTime = ()=> {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const toNumber = (value, fallback = 0) => {
        const parsed = typeof value === 'string' ? parseFloat(value) : Number(value)
        return Number.isFinite(parsed) ? parsed : fallback
    }

    const formatNumber = (value, options = {}) => {
        const {
            locale = 'bn-BD',
            minimumFractionDigits = 0,
            maximumFractionDigits = 0,
            fallback = '0'
        } = options

        if (value === null || value === undefined || value === '') {
            return fallback
        }

        return toNumber(value).toLocaleString(locale, {
            minimumFractionDigits,
            maximumFractionDigits
        })
    }

    const formatPrice = (value, options = {}) => {
        const {
            locale = 'en-IN',
            minimumFractionDigits = null,
            maximumFractionDigits = null,
            fallback = '0'
        } = options

        if (value === null || value === undefined || value === '') {
            return fallback
        }

        const number = toNumber(value)
        const isInteger = Number.isInteger(number)

        return number.toLocaleString(locale, {
            minimumFractionDigits: minimumFractionDigits ?? (isInteger ? 0 : 2),
            maximumFractionDigits: maximumFractionDigits ?? (isInteger ? 0 : 2)
        })
    }

    const httpReq = async (obj = {}) => {
        let responseData = {}
        const loading = ref(false)
        const error = ref(null)

        try {
            loading.value = true
            error.value = null

            const method = (obj.method || 'post').toLowerCase()

            // ⭐ axios config object
            const config = {
                params: obj.params || undefined,
                responseType: obj.responseType || 'json',
                headers: obj.headers || {},
                timeout: obj.timeout || undefined,
            }

            if (method === 'get') {
                responseData = await api.get(obj.url, config)
            }
            else if (method === 'post') {
                responseData = await api.post(obj.url, obj.data, config)
            }
            else if (method === 'put') {
                responseData = await api.put(obj.url, obj.data, config)
            }
            else if (method === 'delete') {
                responseData = await api.delete(obj.url, { ...config, data: obj.data })
            }
            else if (method === 'patch') {
                responseData = await api.patch(obj.url, obj.data, config)
            }

            //  Auth fail
            if (responseData && responseData.data && parseInt(responseData.data.status) === 4001) {

                const isAuthPage = window.location.pathname.startsWith('/auth') || window.location.pathname === '/';
                if (!isAuthPage) {
                    window.location.href = '/auth/login'
                }
                return null
            }

        } catch (err) {
            error.value = err
            console.error(err)
            await toastAlert('error', 'Server error or network problem.')
            //
            // if (err.response?.status === 401) {
            //     window.location.href = '/auth/login'
            // }
        } finally {
            loading.value = false
        }

        return obj.responseType === 'blob'
            ? responseData
            : responseData?.data
    }

    const urlGenerate = (url = false, id = null) => {
        if (url && id) return `${store.baseUrl}/parents_mobil/${url}/${id}`;
        if (id) return `${store.baseUrl}/${id}`;
        if (url) return `${store.baseUrl}/parents_mobil/${url}`;
        return `${store.baseUrl}`;
    };

    const getData = async (obj={})=>{
        const {
            url = false,
            uid = false,
            method = "get",
            rtn  = false,
            data = {}
        } = obj;


        try {
            store.loading = true
            const readData = await httpReq({
                url: urlGenerate(url, uid),
                method,
                data
            });

            if(parseInt(readData?.status) === 2000){
                if(rtn){
                    return readData.result
                }
                store.data = readData.result
            }
            else {
                toastAlert(parseInt(readData?.status) ,readData.message)
            }
        }catch (err){
            console.error(err)
        }
        finally {
            store.loading = false
        }
    }


    const getDataList = async (dataObject = {}) => {
        const {
            url = false,
            uid = false,
            method = "get",
            formFilter = store.formFilter || {},
            page = 1,
            callback = false,
            per_page = store.per_page,
            rtn = false
        } = dataObject;

        try {
            store.loading = true;

            const readData = await httpReq({
                url: urlGenerate(url, uid),
                method,
                params: {
                    page,
                    per_page,
                    ...formFilter
                },
            });

            const status = parseInt(readData?.status);
            const result = readData?.result || {};

            switch (status) {

                case 1000:
                case 1001:
                case 2000:
                case 2001:

                    if (rtn) {
                        return result;
                    }

                    store.dataList = result;

                    if (typeof callback === "function") {
                        callback(result);
                    }

                    break;

                case 3000:
                    toastAlert(
                        status,
                        readData?.message || "Operation failed"
                    );
                    break;

                case 4001:
                    showConfirm(
                        "error",
                        readData?.message || "Access denied",
                        "Oops...!"
                    );

                    toastAlert(
                        status,
                        readData?.message || "Access denied"
                    );


                    break;

                case 5000:
                    toastAlert(
                        status,
                        readData?.message || "Something went wrong"
                    );
                    break;

                case 5001:
                    showConfirm(
                        "error",
                        readData?.message || "Access denied",
                        "Oops...!"
                    );


                    break;

                default:
                    console.warn(
                        "Unhandled status:",
                        readData?.status
                    );
            }

            return result;

        } catch (error) {
            console.error("getDataList error:", error);

            toastAlert(
                "error",
                error?.message || "Something went wrong"
            );

            return null;

        } finally {
            store.loading = false;
        }
    };

    const submitData = async (submitObject = {}) => {
        const {
            data = false,
            url = false,
            id = false,
            reset = false,
            callback = false,
            rtn = false,
            rtnFullResp = false,
            method: callerMethod = false,
        } = submitObject;

        const formData = data || store.formData || {};

        try {
            store.loading = true;
            store.error = {};

            // Determine method: caller's explicit method > id-based fallback > default post
            const finalMethod = callerMethod || (id ? "put" : "post");

            // Determine URL
            let finalUrl;
            if (url) {
                finalUrl = id ? urlGenerate(url, id) : urlGenerate(url);
            } else {
                finalUrl = store.updateId > 0
                    ? urlGenerate("", store.updateId)
                    : urlGenerate();
            }

            // Make request
            const readData = await httpReq({
                method: finalMethod,
                url: finalUrl,
                data: formData,
            });

            if(rtnFullResp){
                return readData
            }

            // Handle response
            if (parseInt(readData?.status) === 2000) {
                if (reset) {
                    store.formData = {};
                    store.updateId = 0;
                }


                toastAlert(readData.status, readData.message || "Operation successful");
                if (typeof callback === "function") callback(readData);

                if (rtn) {
                    return readData.result
                }
                return true

            } else if(parseInt(readData?.status) === 8000) {
                showConfirm('Access Denied', readData?.message);

            }

            else if(parseInt(readData?.status) === 3000){
                store.errors = readData.result || {};
                toastAlert(readData.status, readData.message || "Something went wrong");
                return false;

            } else {
                toastAlert(readData.status, readData.message || "Something went wrong");
                return false;
            }


        } catch (error) {
            console.error("Submit Error:", error);
            toastAlert("error", error.message || "Submission failed");
        } finally {
            store.submitLoading = false;
            store.loading = false;
        }
    };

    const getConfiguration =async () =>{
        try {
            const resp = await httpReq({ url: 'auth/parents_mobil/configuration', method: 'get' });
            if (parseInt(resp?.status) === 2000) {

                const user = resp?.result?.user
                store.user = user
                if (user?.locale && ['en', 'bn'].includes(user.locale)) {
                    store.currentLocale = user.locale;
                }
                store.isReady = true
            }
        } catch (err) {
            console.error('App configuration fetch failed:', err);
        }
    }

    const getAuthToken = async () => {
        try {
            if (store.authToken) return store.authToken;

            const token = await CP.get('auth_token');
            if (!token){
                console.log('auth token not found form cap pref')
            }

            store.authToken = token
            return store.authToken;
        }catch (err){
            console.error(err);
        }
    }

    const checkDuplicate = async (obj = {}) => {
        const tableName   = obj.tableName;
        const field       = obj.field;
        const value       = obj.value;

        const ignoreId   = obj.ignoreId ?? null;

        store.existingField = null;
        store.existingData = [];

        const normalizedValue = (value ?? '').toString().trim().toLowerCase();
        if (!normalizedValue) return null;

        if (!tableName || !field) {
            console.warn('Missing tableName or field');
            return null;
        }
        const payload = {
            'tableName': tableName,
            'field': field,
            'value': value,
            'ignoreId': ignoreId,
        }

        try {
            const res =  await httpReq({
                url:'parents_mobil/check_duplicate',
                data:payload
            })

            if(parseInt(res.status) === 2000) {
                return res.result
            }

        } catch (error) {
            console.error('Duplicate check error:', error);
            return null;
        }
    };


    const updateUser = async (data) => {
        const  user =  submitData({
            url:'user/edit',
            data:data,
            rtn:true
        })

        if (user) {
            return user;
        }
        else {
            return null;
        }
    }


    const getGeneralData = async (requiredData = []) => {
        try {
            const readData = await httpReq({
                url: "parents_mobil/general",
                method: "post",
                data:  requiredData,
            });

            if (parseInt(readData.status) === 2000) {
                store.generalData = {
                    ...store.generalData,
                    ...(readData.result || {})
                };
            } else {
                toastAlert(readData.status, readData.message);
            }
        } catch (error) {
            console.error("getGeneralData error:", error);
        }
    };


    const deleteData = async (obj = {}) => {

        const conf = await showConfirm(
            t('common.confirm'),
            t('common.confirm_delete')
        );

        if (!conf) return;

        store.loading = true;
        try {

            const resp = await httpReq({
                url: urlGenerate(obj.url , obj.id),
                method: 'delete',
            });

            if (parseInt(resp.status) === 2000) {
                toastAlert('success', resp?.message);
                return true
            } else {
                toastAlert(parseInt(resp.status), resp.message);
                return false;
            }

        } catch (e) {
            console.error(e);
            toastAlert('error', 'Something went wrong');
        }
        finally {
            store.loading = false;
        }
    };



    // Helper: convert blob to base64
    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    }

    const isFileExists = async (path) => {
        try {
            await Filesystem.stat({
                path,
                directory: Directory.Data
            })
            return true
        } catch {
            return false
        }
    }

    const downloadFileFormServer = async (serverPath) => {
        try {
            if (!serverPath) {
                throw new Error('Invalid server path')
            }

            // 🧹 Normalize path (remove starting slash)
            const localPath = serverPath.replace(/^\/+/, '')

            // ✅ Check if already exists locally
            const exists = await isFileExists(localPath)
            if (exists) {
                console.log('📁 File already exists locally:', localPath)
                return
            }

            store.loading = true

            // 📥 Download file as BLOB
            const response = await httpReq({
                url: 'parents_mobil/download-file',
                method: 'post',
                data: { path: localPath },
                responseType: 'blob', // ⭐ MUST
            })

            if (!response || !response.data) {
                throw new Error('Empty blob response from server')
            }

            // 🧠 Ensure it is really a Blob
            if (!(response.data instanceof Blob)) {
                throw new Error('Response is not a Blob')
            }

            // 🔄 Convert blob → base64
            const base64Data = await blobToBase64(response.data)
            const base64String = base64Data.split(',')[1]

            if (!base64String) {
                throw new Error('Invalid base64 conversion')
            }

            // 💾 Save to Capacitor filesystem
            await Filesystem.writeFile({
                path: localPath,
                data: base64String,
                directory: Directory.Data,
                recursive: true,
            })

            console.log('✅ File saved locally:', localPath)

        } catch (error) {
            console.error('❌ Error saving file:', error)
            toastAlert('error', 'File save failed.')

        } finally {
            store.loading = false
        }
    }



    const loadConfigurations = async (response) => {

        try {

            // ================= RESPONSE DATA =================

            const result = response?.result ?? {};

            const user = result.user ?? {};
            const access_token = result.access_token ?? null;

            // ================= VALIDATION =================

            if (!user?.id || !access_token) {
                toastAlert('error', 'Invalid configuration data.');
                return false;
            }

            // ================= STORE INIT =================
            store.userId = user.id;

            // =========================================================
            // USERS
            // =========================================================

            try {
                store.user = user;
                // Set locale from user profile (no DB query needed)
                if (user?.locale ) {
                    store.currentLocale = user.locale;
                }

                // Populate configuration data if returned in the login/auth payload
                if (result.business) {
                    store.businesses = result.business;
                }
                if (result.menus) {
                    store.menus = result.menus;
                }
                if (result.permissions) {
                    store.permissions = result.permissions;
                }
                if (result.permissions && result.menus) {
                    store.isReady = true;
                }
            } catch (err) {
                console.error('User store error:', err);
            }

            return true;

        } catch (error) {

            console.error('loadConfigurations error:', error);

            toastAlert(
                'error',
                'Configuration load failed: ' + (error?.message || error)
            );

            return false;
        }
    };




    const menuAcs = async (menuName) => {
        // Always use store.menus (populated at login via configuration API)
        const data = Array.isArray(store.menus) ? store.menus : [];
        return data.includes(menuName);
    }


    const can = async (names, mode = 'any') => {
        // Always use store.permissions (populated at login via configuration API)
        const data = Array.isArray(store.permissions) ? store.permissions : [];

        if (Array.isArray(names)) {
            if (mode === 'all') {
                return names.every(name => data.includes(name));
            } else {
                return names.some(name => data.includes(name));
            }
        } else {
            return data.includes(names);
        }
    };


    const getLocalFileUri = async (relativePath) => {
        try {
            // remove leading slash
            const cleanPath = relativePath.replace(/^\/+/, '')

            // get native file uri
            const file = await Filesystem.getUri({
                path: cleanPath,
                directory: Directory.Data,
            })

            // convert for WebView
            return Capacitor.convertFileSrc(file.uri)

        } catch (error) {
            console.log('File not found:', error)
            return null
        }
    }

    // ========== METHODS ==========
    const formatDate = (dateString) => {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);

            const hasTime =
                dateString.includes('T') ||
                /\d{2}:\d{2}/.test(dateString);

            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            if (hasTime) {
                options.hour = '2-digit';
                options.minute = '2-digit';
                options.hour12 = true;
            }

            return new Intl.DateTimeFormat('bn-BD', options).format(date);
        } catch (e) {
            return dateString;
        }
    };



    const logout = async () =>{
        submitData({url:'logout'})

        await CP.remove('auth_token');
        await CP.remove('user');

        window.location.href = '/auth/login'
    }

    const loadUser = async () =>{
      const cachedUser = await CP.get('user')
      if (cachedUser) {
          store.user = cachedUser
      }

      const user  = await getData({url:'me',rtn:true})
      if (user){
          await CP.remove('user')
          await CP.set('user',user)
          store.user = user
      }
    }


    const fileUpload = async (event, dataObject, dataModel, removeOld = true) => {
        const file = event.target.files?.[0];
        if (!file) {
            return toastAlert("error", "No file selected!", "Oops...!");
        }

        if (removeOld) {
            if (dataObject[dataModel]) {
                await fileRemove(dataObject, dataModel);
            }
        }
        const formData = new FormData();
        formData.append("file", file);

        store.uploadLoading = true;
        store.submitLoading = true;
        try {
            const readData = await httpReq({
                method: "post",
                url: 'parents_mobil/upload',
                data: formData,
            });

            if (readData && parseInt(readData.status) === 2000) {
                if (dataObject && dataModel) {
                    dataObject[dataModel] = readData.result;
                }
                toastAlert(readData.status, readData.message || "File uploaded successfully");
            } else if (readData) {
                toastAlert("error", readData.message || "Upload failed!", "Oops...!");
            } else {
                toastAlert("error", "Upload failed!", "Oops...!");
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            store.uploadLoading = false;
            store.submitLoading = false;
        }
    };

    const fileRemove = async (dataObject, dataModel, fileName = null) => {
        try {
            let file = fileName === null ? dataObject[dataModel] : fileName;
            const readData = await httpReq({
                method: "post",
                url: 'parents_mobil/file_remove',
                data: { file_name: file },
            });
            
            if (readData && parseInt(readData.status) === 2000) {
                if (fileName === null && dataObject && dataModel) {
                    dataObject[dataModel] = null;
                }
                toastAlert('success', readData.message);
            } else if (readData) {
                toastAlert('error', readData.message);
            }
        } catch (error) {
            toastAlert('error', error.message);
        }
    };



    // ─── Profile API helpers ───────────────────────────────────────────────

    /**
     * Upload an image from a dataUrl (base64) string — converts to Blob and
     * uses the existing /upload endpoint. Returns the server file path or null.
     */
    const uploadImageDataUrl = async (dataUrl) => {
        if (!dataUrl) return null
        try {
            const res  = await fetch(dataUrl)
            const blob = await res.blob()
            const ext  = blob.type.split('/')[1] || 'jpg'
            const file = new File([blob], `upload_${Date.now()}.${ext}`, { type: blob.type })
            const formData = new FormData()
            formData.append('file', file)
            store.uploadLoading = true
            const readData = await httpReq({ method: 'post', url: 'parents_mobil/upload', data: formData })
            if (parseInt(readData?.status) === 2000) {
                return readData.result
            } else {
                toastAlert('error', readData?.message || 'Upload failed!')
                return null
            }
        } catch (err) {
            console.error('uploadImageDataUrl error:', err)
            toastAlert('error', 'Image upload failed.')
            return null
        } finally {
            store.uploadLoading = false
        }
    }

    /** Update basic profile info (name, gender, address, photo) */
    const updateProfile = async (data) => {
        return await submitData({ url: 'profile/update', data, rtn: true })
    }

    /** Update NID info + images */
    const updateNidInfo = async (data) => {
        return await submitData({ url: 'profile/update-nid', data, rtn: true })
    }

    /** Send OTP to phone via SMS */
    const sendPhoneOtp = async () => {
        return await httpReq({ method: 'post', url: 'parents_mobil/profile/send-phone-otp' })
    }

    /** Verify phone OTP */
    const verifyPhoneOtp = async (otp) => {
        return await httpReq({ method: 'post', url: 'parents_mobil/profile/verify-phone-otp', data: { otp } })
    }

    /** Send OTP to email */
    const sendEmailOtp = async () => {
        return await httpReq({ method: 'post', url: 'parents_mobil/profile/send-email-otp' })
    }

    /** Verify email OTP */
    const verifyEmailOtp = async (otp) => {
        return await httpReq({ method: 'post', url: 'parents_mobil/profile/verify-email-otp', data: { otp } })
    }

    /** Change password */
    const changePasswordApi = async (data) => {
        return await httpReq({ method: 'post', url: 'parents_mobil/profile/change-password', data })
    }

    /** Update device token for Push Notifications */
    const updateDeviceToken = async (data) => {
        return await httpReq({ method: 'post', url: 'parents_mobil/profile/update-device-token', data })
    }

    // ──────────────────────────────────────────────────────────────────────

    return {
        baseUrl,
        getGeneralData,
        deleteData,
        getLocalFileUri,
        LFA,
        menuAcs,
        can,
        urlGenerate,
        httpReq,
        loadConfigurations,
        getDateTime,
        checkDuplicate,
        getConfiguration,
        submitData,
        print,
        formatNumber,
        formatPrice,
        getDataList,
        getData,
        updateUser,
        formatDate,
        getAuthToken,
        logout,
        loadUser,
        fileUpload,
        fileRemove,
        // Profile helpers
        uploadImageDataUrl,
        updateProfile,
        updateNidInfo,
        sendPhoneOtp,
        verifyPhoneOtp,
        sendEmailOtp,
        verifyEmailOtp,
        changePasswordApi,
        updateDeviceToken,
    }
}
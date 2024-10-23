// Validation Functions 

import { getItemFromStorage } from "./auth";

export const EmailValidation = (value: any) => {
    const pattern = /^\S+@\S+\.\S+$/;
    var emailValue = "";
    if (value != null && value !== undefined) {
        if (typeof value === "string") {
            emailValue = value;
        }
        else {
            emailValue = value?.value;
        }
        return emailValue.trim() != "" ?
            pattern.test(emailValue) ?
                { valid: true, message: '' }
                : { valid: false, message: 'Invalid Email' }
            : { valid: true, message: '' }
    } else {
        return { valid: true, message: '' }
    }
}

export const AccountNumberValidation = (value: any) => {
    return value ?
        value.toString().length === 17 ?
            { valid: true, message: '' }
            : { valid: false, message: 'Account Number must be exactly 17 digits' }
        : { valid: true, message: '' }
}

export const AddressOneValidation = (value: any) => {
    return value ?
        value.length < 100 ?
            { valid: true, message: '' }
            : { valid: false, message: 'Exceed Maximum Word (100)' }
        : { valid: true, message: '' }
}

export const AddressTwoValidation = (value: any) => {
    return value ?
        value.length < 50 ?
            { valid: true, message: '' }
            : { valid: false, message: 'Exceed Maximum Word (50)' }
        : { valid: true, message: '' }
}

export const PhoneNoValidation = (value: any) => {
    const pattern = /^09\d{7,9}$/;
    return (value != null && value !== undefined && value !== "") ?
        pattern.test(value.toString()) ?
            { valid: true, message: '' }
            : { valid: false, message: 'Phone number must start with "09" and is followed by 7 to 9 digits' }
        : { valid: true, message: '' }
}

export const CleanPhoneNumber = (phoneNumber: any) => {
    // Remove non-numeric characters using a regular expression
    return phoneNumber?.replace(/\D/g, '');
}

export const LuhnCheckValidation = (value: any) => {
    let creditCardNumber = "";
    if (value != null && value !== undefined) {
        if (typeof value === "string") {
            creditCardNumber = value;
        }
        else {
            creditCardNumber = value?.value;
        }
        if (!creditCardNumber) return { valid: true, message: '' };
        if (creditCardNumber.length !== 16) return { valid: false, message: 'Card Number must be 16 digits' };

        const sumOfDigits = Array.from(creditCardNumber).reverse().reduce((sum, digit, index) => {
            const num = parseInt(digit, 10);
            if (index % 2 === 0) {
                return sum + num;
            } else {
                const doubled = num * 2;
                return sum + Math.floor(doubled / 10) + (doubled % 10);
            }
        }, 0);

        return sumOfDigits % 10 === 0 ? { valid: true, message: '' } : { valid: false, message: 'Invalid card number' };
    }
    else {
        return { valid: true, message: '' }
    }

};
export const CIFNumberValidation = (value: any) => {
    const pattern = /^\d{9,10}$/;
    return (value != null && value !== undefined && value !== "") ?
        pattern.test(value.toString()) ?
            { valid: true, message: '' }
            : { valid: false, message: 'CIF Number must be 9 digits or 10 digits' }
        : { valid: true, message: '' }
}

export const WordCountValidation = (value: any, min: number, max: number) => {
    if (min === max) {
        return value != "" ?
            value?.length === max ?
                { valid: true, message: '' }
                : { valid: false, message: `Value must be exactly ${max} characters` }
            : { valid: true, message: '' }
    }
    else if (min === 0) {
        return value != "" ?
            value?.length < max ?
                { valid: true, message: '' }
                : { valid: false, message: `Maximun Charater is ${max}` }
            : { valid: true, message: '' }
    }
    else {
        return value != "" ?
            value?.length > min && value?.toString().length < max ?
                { valid: true, message: '' }
                : { valid: false, message: `Value must be between ${min} and ${max}` }
            : { valid: true, message: '' }
    }
}

export const HouseNoValidation = (value: any) => {
    const pattern = /^[a-zA-Z0-9\s]{1,5}$/;
    return (value != null && value !== undefined && value !== "") ?
        pattern.test(value.toString()) ?
            { valid: true, message: '' }
            : { valid: false, message: 'House No must be 5 words and contain only characters & numbers' }
        : { valid: true, message: '' }
}

export const AmountValidation = (value: any, min: number, max: number) => {
    if (min === max) {
        return value != "" ?
            value === max ?
                { valid: true, message: '' }
                : { valid: false, message: `Value must be exactly ${max} characters` }
            : { valid: true, message: '' }
    }
    else if (min === 0) {
        return value != "" ?
            value <= max ?
                { valid: true, message: '' }
                : { valid: false, message: `Maximun Charater is ${max}` }
            : { valid: true, message: '' }
    }
    else {
        return value != "" ?
            value >= min && value <= max ?
                { valid: true, message: '' }
                : { valid: false, message: `Value must be between ${min} and ${max}` }
            : { valid: true, message: '' }
    }
}

export const checkDebitCardValid = (value: any) => {
    let creditCardNumber = "";
    if (value != null && value !== undefined) {
        if (typeof value === "string") {
            creditCardNumber = value;
        }
        else {
            creditCardNumber = value.value;
        }

        const firstSixString = creditCardNumber?.substring(0, 6);

        return firstSixString !== '950305'
            ? { valid: false, message: 'Please Use Credit Card' }
            : { valid: true, message: '' };
    }
    else {
        return { valid: true, message: '' }
    }
};

export const checkCreditCardValid = (value: any) => {
    let creditCardNumber = "";
    if (value !== undefined && value !== null) {
        if (typeof value === "string") {
            creditCardNumber = value;
        }
        else {
            creditCardNumber = value.value;
        }

        const firstSixString = creditCardNumber?.substring(0, 6);

        return firstSixString === '950305'
            ? { valid: false, message: 'Please Use Credit Card' }
            : { valid: true, message: '' };
    }
    else {
        return { valid: true, message: '' }
    }
};

// End Validation Functions 

// ************************************************************************************************************************************
// ************************************************************************************************************************************
// Common Functions 
export const getBoolean = (value: any) => {
    switch (value) {
        case true:
        case "true":
        case 1:
        case "1":
            return true;
        default:
            return false;
    }
}

export const toBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (error) => reject(error);
        reader.onloadend = () => resolve(reader.result as any);
        reader.readAsDataURL(file);
    });

export const formatDate = (dateString: string) => {
    const [datePart, offsetPart] = dateString.split('+');
    const formattedDate = new Date(`${datePart}Z`).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    });

    return `${new Date(formattedDate).toISOString()}`;
};

export const removeTabIndex = () => {
    // Get the modal container
    const modalContainer = document.querySelector('.swal2-container');

    // Remove tabindex from all focusable elements inside the modal
    const focusableElements = modalContainer?.querySelectorAll('[tabindex]');
    focusableElements?.forEach((element) => {
        element.removeAttribute('tabindex');
    });
};

export const maskCard = (CardNumber: string): string => {
    const maskedNumber = CardNumber.replace(/(\d{6})\d+(\d{4})$/, '$1******$2');
    return maskedNumber;
};

export const FilterBranchByRoles = (filteredBranches: any) => {
    // Create a new branch object
    const newBranch = {
        BRANCH_CODE: '000',
        BRANCH_NAME: 'ALL',
    };
    if (!getItemFromStorage('auth').AllowAll) {
        // If not AllowAll, filter the BranchInfo array based on branchCode
        filteredBranches = filteredBranches?.filter((branch: any) =>
            branch.BRANCH_CODE == getItemFromStorage('auth').branchCode);
    } else {
        // If AllowAll is true, filter the BranchInfo array to check if newBranch is already added
        const alreadyAdded = filteredBranches?.filter((branch: any) =>
            branch.BRANCH_CODE === newBranch.BRANCH_CODE && branch.BRANCH_NAME === newBranch.BRANCH_NAME
        );

        // If newBranch is not already added, add it to the beginning of the array
        if (alreadyAdded && alreadyAdded.length === 0) {
            filteredBranches?.unshift(newBranch);
        }
    }
    return filteredBranches;
}

// Function to check if a field is required
export const isFieldRequired = (schema: any, fieldName: string): string => {
    try {
        const fieldValidation = schema.fields[fieldName];

        // Check if the field has a 'required' validation
        if (fieldValidation.tests.some((test: any) => test.OPTIONS?.name === 'required')) {
            return '<span style="color: red; font-size: 10px">✱</span>'; // Field is required
        } else {
            return ""; // Field is not required
        }
    } catch (error: any) {
        return '<span style="color: red; font-size: 10px">✱</span>';
    }
};
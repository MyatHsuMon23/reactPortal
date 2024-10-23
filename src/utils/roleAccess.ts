
export const checkControlsByRole = (role: string, action: string) => {
    if (role === 'CHECKER' && action.toLowerCase().includes('create')) {
        return false;
    }
    var roles = [
        {
            name: 'MAKER',
            doNotAllowed: ['AdjustmentCreate', 'DeliveryCreate']
        },
        {
            name: 'CHECKER',
            doNotAllowed: ['NoCreate']
        },
        {
            name: 'CARDOPS',
            doNotAllowed: ['Received']
        },
        {
            name: 'TSD',
            doNotAllowed: []
        },
        {
            name: 'TSDAD',
            doNotAllowed: []
        }
    ]
    var filtered = roles.filter((item: any) => item.name == role);
    if (filtered && !filtered[0]?.doNotAllowed?.includes(action)) {
        return true;
    }
    return false;
}

export const AllowAll = (role: string) => {
    if (role == "CARDOPS" || role == "TSD" || role == "TSDAD") {
        return true;
    }
    else {
        return false;
    }
}
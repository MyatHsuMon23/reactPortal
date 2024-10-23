export const endpoint = {
    getToken: `post:requesttoken`,
    postApiLogin: `post:auth/central/login`,
    getImage: `get:`,

    //Admin
    querybystaffid: `post:querybystaffid`,
    getAllADList: `post:auth/central/getAllADUsers`,
    createOrKillUserSession: 'post:auth/central/addNewUser',
    removeUserSession: 'post:auth/central/removeUser',
    
    //ATM
    getATMList: `post:atm/getAtmLists`,
    getATMById: `get:atm/getAtmById`,
    createATM: `post:atm/createATM`,
    updateATM: `post:atm/updateATM`,
    deleteATM: `post:atm/deleteATM`,

    //Replenishment
    getReplinshmentList: `post:replinsh/getReplishLists`,
    getReplinshmentById: `get:replinsh/getReplishbyId`,
    createReplenish: `post:replinsh/createReplenishment`,
    updateReplenish: `post:replinsh/updateReplenishment`,
    deleteReplenish: `post:replinsh/deleteReplenishment`,
    // InstantCardIssue
    getInstantCardIssueList: `post:card/issue/list`,
    getInstantCardIssueById: `get:card/issue/getIssuing`,
    getCustomerKYCByAccNo: `get:Corebanking/CustomerKYCbyAccountNumber`,
    getDigiOnboardingDataByCustomerNo: `get:DigitalOnboarding/Customer`,
    saveInstantCardIssue: `post:CardIssuing/SaveDraft`,
    submitInstantCardIssue: `post:CardIssuing/Submitted`,
    approveInstantCardIssue: `post:CardIssuing/Process`,
    deleteInstantCardIssue: `post:CardIssuing/Delete`,
    updateInstantCardIssue: `post:CardIssuing/Update`,
    getKYCByAccountNo: `get:kycbyacctno`,

    //Card Delivery
    getCardDeliveryList: `get:card/delivery/list`,
    receiveCardDelivery: `post:card/delivery/receive`,
    saveCardDelivery: `post:card/delivery/add`,

    //Branch List
    getBranchList: `get:branch/getBranchLists`,

    //Card Adjustment
    getCardAdjustmentList: `post:card/adjustment/list`,
    saveCardAdjustment: `post:card/adjustment/create`,

    //KYC Info Update
    getKYCInfoUpdateList: `post:updatekyc/list`,

    // Reports
    getCardStockSummaryList: `post:report/cardstockreportsummary`,
    getCardStockDetail: `post:report/cardstockreportdetail`,
    getCardIssuingReport: `post:report/cardissuing`,
    getCardClosedReport: `post:report/cardclose`,
    getCardActivatedReport: `post:report/cardactivate`,
    getTopupReport: `post:report/topupReportList`,

    //Old Reports
    getOldCardIssuingReport: `post:oldReport/OldCardIssuingReport`,
    getOldCardClosingReport: `post:oldReport/OldCardClosingReport`,
    getCardActionReport: `post:oldReport/GetCardActionRecordFromSVTran`,

    //Card Services
    // getCard: `post:cdms/getcard`,
    getCard: `post:getCardInfo`,
    pinResetAction: `post:cardpinreset`,
    cardClose: `post:cardclose`,
    creditCardActivate: `post:cardActivate`,

    enquiryCardList: `post:CardEnquiryList`,

    //KYC Update
    getKYCInfo: `post:customer-update/GetKyc`,
    saveDraft: `post:customer-update/SaveDraft`,
    submitted: `post:customer-update/Submitted`,
    update: `post:customer-update/Update`,
    delete: `post:customer-update/Delete`,
    approve: `post:customer-update/Process`,
    GetKYCById: `get:updatekyc/kyc`,

    //Prepaid API
    getKYCByCIF: `get:kycbycif`,
    getBalanceEnquiry: `post:balanceEnquiry`,
    getTopupList: `post:PrepaidCard/TopupList`,
    topupFormSubmit: `post:PrepaidCard/TopupSubmitted`,
    topupFormApprove: `post:PrepaidCard/TopupApprove`,
    getToupById: `post:PrepaidCard/TopupInfoById`,

    //Prepaid Issue
    getPrepaidIssueList: `post:card/issue/prepaid/list`,
    prepaidSaveDraft: `post:PrepaidCardIssuing/SaveDraft`,
    prepaidSubmitted: `post:PrepaidCardIssuing/Submitted`,
    prepaidApproved: `post:PrepaidCardIssuing/Approve`,
    prepaidUpdated: `post:PrepaidCardIssuing/Update`,
    prepaidDeleted: `post:PrepaidCardIssuing/Delete`,

    //Prepaid KYC
    getKYCList: `post:updatekyc/prepaidlist`,
    getKYCByCardNo: `post:PrepaidCustomerUpdate/GetKyc`,
    prepaidKYCSaveDraft: `post:PrepaidCustomerUpdate/SaveDraft`,
    prepaidKYCSubmitted: `post:PrepaidCustomerUpdate/Submitted`,
    prepaidKYCApprove: `post:PrepaidCustomerUpdate/Approve`,
    prepaidKYCDelete: `post:PrepaidCustomerUpdate/Delete`,
}
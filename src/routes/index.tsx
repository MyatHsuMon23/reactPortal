import { IAllRoute, IRoute } from "../types/RouteType";
import { lazy } from "react";

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
// ***** ATM *****
const ATMList = lazy(() => import("@/pages/ATMList/ATMList"));
const Replinshment = lazy(() => import("@/pages/ATMList/ReplinshmentList"));
// ***** Card Delivery *****
const CardDelivery = lazy(() => import("@/pages/Delivery/CardsDelivery"));
const CardsAdjustment = lazy(() => import("@/pages/Delivery/CardsAdjustment"));
// ***** Instant Card Issue *****
const InstantCardIssue = lazy(() => import("@/pages/InstantCardIssue/InstantCardIssue"));
const PrepaidCardIssueList = lazy(() => import("@/pages/PrepaidCard/PrepaidCardIssueList"));
const BalanceEnquiry = lazy(() => import("@/pages/PrepaidCard/BalanceEnquiry"));
const TopUpList = lazy(() => import("@/pages/PrepaidCard/TopUpList"));
const PrepaidKYCUpdateList = lazy(() => import("@/pages/PrepaidCard/PrepaidKYCUpdateList"));
// ***** KYC Info Update *****
const CreditCardInfoUpdate = lazy(() => import("@/pages/KYCInfoUpdated/CreditCardInfoUpdate"));
const DebitCardInfoUpdate = lazy(() => import("@/pages/KYCInfoUpdated/DebitCardInfoUpdate"));
const BusinessCustomerInfoUpdate = lazy(() => import("@/pages/KYCInfoUpdated/BusinessCustomerInfoUpdate"));
// ***** Reports *****
const CardStockSummary = lazy(() => import("@/pages/Reports/CardStockSummary"));
const CardStockDetail = lazy(() => import("@/pages/Reports/CardStockDetail"));
const CardIssuingReport = lazy(() => import("@/pages/Reports/CardIssuingReport"));
const CardClosedReport = lazy(() => import("@/pages/Reports/CardCloseReport"));
const CardActivateReport = lazy(() => import("@/pages/Reports/CardActivateReport"));
const TopupReport = lazy(() => import("@/pages/Reports/TopupReport"));

// ***** Old Card Reports *****
const OldCardIssuingReport = lazy(() => import("@/pages/OldReports/CardIssuingReport"));
const OldCardClosingReport = lazy(() => import("@/pages/OldReports/CardClosingReport"));
const CardActionReport = lazy(() => import("@/pages/OldReports/CardActionReport"));

// ***** Card Services *****
const cardEnquiryList = lazy(() => import("@/pages/CardServices/CardEnquiryList"));
const CardPinReset = lazy(() => import("@/pages/CardServices/CardPinReset"));
const CardClose = lazy(() => import("@/pages/CardServices/CardClose"));
const CardActivate = lazy(() => import("@/pages/CardServices/CardActivate"));

//**** Admin */
const UserList = lazy(()=> import("@/pages/Admin/UserList"));

const SignIn = lazy(() => import("@/pages/security/authentication/signIn"));
const Page404 = lazy(() => import("@/pages/security/authentication/Page404"));
import { AssuredWorkload, Circle, CreditCard, FileCopy, ShoppingCart, MiscellaneousServices, Summarize, HomeOutlined } from '@mui/icons-material';

const style = {
    fontSize: '8px !important'
}

// Menu List
export const routes: Array<IRoute> = [
    {
        key: 'dashboard',
        title: 'Dashboard',
        enabled: true,
        path: '/',
        component: Dashboard,
        icon: <HomeOutlined />,
        subMenus: [
            {
                key: 'dashboard',
                title: 'Dashboard',
                enabled: true,
                path: '/',
                component: Dashboard,
                icon: <Circle sx={style} />,
            }
        ]
    },
    {
        key: 'admin',
        title: 'Admin',
        enabled: true,
        path: '/admin',
        component: UserList,
        icon: <CreditCard />,
        subMenus: [
            {
                key: 'userList',
                title: 'Users',
                enabled: true,
                path: '/userList',
                component: UserList,
                icon: <Circle sx={style} />,
            }
        ]
    },
    {
        key: 'atmList',
        title: 'ATM',
        enabled: true,
        component: ATMList,
        path: '/',
        icon: <AssuredWorkload />,
        subMenus: [
            {
                key: 'atmList',
                title: 'ATM List',
                enabled: true,
                path: '/atmList',
                component: ATMList,
                icon: <Circle sx={style} />,
            },
            {
                key: 'replenishment',
                title: 'Replenishment',
                enabled: true,
                path: '/replenishment',
                component: Replinshment,
                icon: <Circle sx={style} />,
            }
        ]
    },
    {
        key: 'cardServices',
        title: 'Card Services',
        enabled: true,
        path: '/',
        component: CardPinReset,
        icon: <MiscellaneousServices />,
        subMenus: [
            {
                key: 'cardEnquiryList',
                title: 'Card Enquiry List',
                enabled: true,
                path: '/cardEnquiryList',
                component: cardEnquiryList,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardPinReset',
                title: 'Card Pin Reset',
                enabled: true,
                path: '/cardPinReset',
                component: CardPinReset,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardActivate',
                title: 'Card Activate',
                enabled: true,
                path: '/cardActivate',
                component: CardActivate,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardClose',
                title: 'Card Close',
                enabled: true,
                path: '/cardClose',
                component: CardClose,
                icon: <Circle sx={style} />,
            },
        ]
    },
    {
        key: 'instantCardIssue',
        title: 'Instant Card',
        enabled: true,
        path: '/instantCardIssue',
        component: InstantCardIssue,
        icon: <CreditCard />,
        subMenus: [
            {
                key: 'instantCardIssue',
                title: 'Instant Card Issue',
                enabled: true,
                path: '/instantCardIssue',
                component: InstantCardIssue,
                icon: <Circle sx={style} />,
            }
        ]
    },
    {
        key: 'prepaidCard',
        title: 'Prepaid Card',
        enabled: true,
        path: '/prepaidCardIssue',
        component: PrepaidCardIssueList,
        icon: <CreditCard />,
        subMenus: [
            {
                key: 'prepaidCardIssue',
                title: 'Prepaid Card Issue',
                enabled: true,
                path: '/prepaidCardIssue',
                component: PrepaidCardIssueList,
                icon: <Circle sx={style} />,
            },
            {
                key: 'topUp',
                title: 'Top Up',
                enabled: true,
                path: '/topUp',
                component: TopUpList,
                icon: <Circle sx={style} />,
            },
            {
                key: 'balanceInquiry',
                title: 'Balance Inquiry',
                enabled: true,
                path: '/balanceInquiry',
                component: BalanceEnquiry,
                icon: <Circle sx={style} />,
            },
            {
                key: 'creditKYCUpdate',
                title: 'Prepaid Card KYC Update',
                enabled: true,
                path: '/creditKYCUpdate',
                component: PrepaidKYCUpdateList,
                icon: <Circle sx={style} />,
            }
        ]
    },
    {
        key: 'KYCInfoUpdate',
        title: 'KYC Update',
        enabled: true,
        component: CreditCardInfoUpdate,
        path: '/',
        icon: <FileCopy />,
        subMenus: [
            // {
            //     key: 'creditCardInfoUpdate',
            //     title: 'Credit KYC Info Update',
            //     enabled: true,
            //     path: '/creditCardInfoUpdate',
            //     component: CreditCardInfoUpdate,
            //     icon: <Circle sx={style} />,
            // },
            {
                key: 'debitCardInfoUpdate',
                title: 'Debit KYC Info Update',
                enabled: true,
                path: '/debitCardInfoUpdate',
                component: DebitCardInfoUpdate,
                icon: <Circle sx={style} />,
            },
            // {
            //     key: 'businessCustomerInfoUpdate',
            //     title: 'Business KYC Info Update',
            //     enabled: true,
            //     path: '/businessCustomerInfoUpdate',
            //     component: BusinessCustomerInfoUpdate,
            //     icon: <Circle sx={style} />,
            // }
        ]
    },
    {
        key: 'delivery',
        title: 'Card Delivery',
        enabled: true,
        path: '/',
        component: CardDelivery,
        icon: <ShoppingCart />,
        subMenus: [
            {
                key: 'cardDelivery',
                title: 'Card Delivery',
                enabled: true,
                path: '/cardDelivery',
                component: CardDelivery,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardAdjustment',
                title: 'Card Adjustment',
                enabled: true,
                path: '/cardAdjustment',
                component: CardsAdjustment,
                icon: <Circle sx={style} />,
            }
        ]
    },
    {
        key: 'reports',
        title: 'Reports',
        enabled: true,
        component: CardStockSummary,
        path: '/',
        icon: <Summarize />,
        subMenus: [
            {
                key: 'cardStockSummary',
                title: 'Card Stock Summary',
                enabled: true,
                path: '/cardStockSummary',
                component: CardStockSummary,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardStockDetail',
                title: 'Card Stock Detail',
                enabled: true,
                path: '/cardStockDetail',
                component: CardStockDetail,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardIssuingReport',
                title: 'Card Issuing Report',
                enabled: true,
                path: '/cardIssuingReport',
                component: CardIssuingReport,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardClosedReport',
                title: 'Card Close Report',
                enabled: true,
                path: '/cardClosedReport',
                component: CardClosedReport,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardActivateReport',
                title: 'Card Activate Report',
                enabled: true,
                path: '/cardActivateReport',
                component: CardActivateReport,
                icon: <Circle sx={style} />,
            },
            {
                key: 'topupReport',
                title: 'Topup Report',
                enabled: true,
                path: '/topupReport',
                component: TopupReport,
                icon: <Circle sx={style} />,
            }
        ]
    },
    {
        key: 'oldReports',
        title: 'Reports For Old Cards',
        enabled: true,
        component: OldCardIssuingReport,
        path: '/',
        icon: <Summarize />,
        subMenus: [
            {
                key: 'oldCardIssuingReport',
                title: 'Card Issuing Report',
                enabled: true,
                path: '/oldCardIssuingReport',
                component: OldCardIssuingReport,
                icon: <Circle sx={style} />,
            },
            {
                key: 'oldCardClosingReport',
                title: 'Card Closing Report',
                enabled: true,
                path: '/oldCardClosingReport',
                component: OldCardClosingReport,
                icon: <Circle sx={style} />,
            },
            {
                key: 'cardActionReport',
                title: 'Card Action Report',
                enabled: true,
                path: '/cardActionReport',
                component: CardActionReport,
                icon: <Circle sx={style} />,
            }
        ]
    },
    {
        key: 'page404',
        title: 'Page 404',
        enabled: true,
        path: '*',
        component: Page404,
        icon: <></>,
        subMenus: [
            {
                key: 'page404',
                title: 'Page 404',
                enabled: true,
                path: '*',
                component: Page404,
                icon: <Circle sx={style} />,
            }
        ]
    },
]

export const authRoutes: Array<any> = [
    //-------------Security Authentication-------------
    {
        key: 'signin',
        title: 'SignIn',
        path: '/',
        enabled: true,
        component: SignIn
    },
    {
        key: 'page404',
        title: 'Page404',
        path: '*',
        enabled: true,
        component: Page404
    },
]
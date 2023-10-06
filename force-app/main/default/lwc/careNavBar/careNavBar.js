import { LightningElement, track, api, wire } from 'lwc';
import Hamburger from '@salesforce/resourceUrl/HamburgerWhite';
import MagGlass from '@salesforce/resourceUrl/MagnifyingGlass';
import UserIcons from '@salesforce/resourceUrl/NavUser';
import ShoppingCart from '@salesforce/resourceUrl/GroceryStore';
import LendWithCareImages from '@salesforce/resourceUrl/LendWithCareImages';
import LWCLogo from '@salesforce/resourceUrl/LWCLogoSvg';
import UserSVG from '@salesforce/resourceUrl/UserSVG';
import svgicons from '@salesforce/resourceUrl/svgicons';
//care cart

import FbIcon from '@salesforce/resourceUrl/FacebookLogo';
import GooIcon from '@salesforce/resourceUrl/GoogleIcon';
import AppIcon from '@salesforce/resourceUrl/AppleIcon';
import AExpress from '@salesforce/resourceUrl/AmericanExpress';
import CC from '@salesforce/resourceUrl/CCard';
import VisaC from '@salesforce/resourceUrl/VisaCard';
import StripeC from '@salesforce/resourceUrl/StripeImage';
import greenfield from '@salesforce/resourceUrl/greenfield';
import searchLoan from '@salesforce/apex/LWC_AllLoansCtrl.searchLoan';

import LWCConfigSettingMetadata from '@salesforce/apex/LWC_AllLoansCtrl.LWCConfigSettingMetadata';
import getLeastToCompleteLoanRecord from '@salesforce/apex/LWC_AllLoansCtrl.getLeastToCompleteLoanRecord';
import removeTransactionRecord from '@salesforce/apex/LWC_AllLoansCtrl.removeTransactionRecord';
import removeTransactionRecords from '@salesforce/apex/LWC_AllLoansCtrl.removeTransactionRecords';
import recurringRecordCreation from '@salesforce/apex/LWC_AllLoansCtrl.recurringRecordCreation';
import createTransactionRecord from '@salesforce/apex/LWC_AllLoansCtrl.createTransactionRecord';
import updateTransactionRecord from '@salesforce/apex/LWC_AllLoansCtrl.updateTransactionRecord';
import updateTransactionRecords from '@salesforce/apex/LWC_AllLoansCtrl.updateTransactionRecords';
import createVDTransaction from '@salesforce/apex/LWC_AllLoansCtrl.createVDTransaction';
import getLenderBalance from '@salesforce/apex/LWC_AllLoansCtrl.getLenderBalance';
import isGuestUser from '@salesforce/apex/LWC_AllLoansCtrl.isGuestUser';
import getCurrentUser from '@salesforce/apex/LWC_AllLoansCtrl.getCurrentUser';
import TopupTransactionRecords from '@salesforce/apex/LWC_AllLoansCtrl.TopupTransactionRecords';
// import processPayment from '@salesforce/apex/StripePaymentController.processPayment';
import { subscribe,createMessageContext, publish } from 'lightning/messageService';
import CARTMC from "@salesforce/messageChannel/CartMessageChannel__c";

import getStripePaymentConfigs from '@salesforce/apex/StripePaymentController.getStripePaymentConfigs';
import processPaymentByCard from '@salesforce/apex/StripePaymentController.processPaymentByCard';
import processPaymentByWallet from '@salesforce/apex/StripePaymentController.processPaymentByWallet';
import processRD from '@salesforce/apex/StripePaymentController.processRD';

// Define a debounce function
const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, delay);
    };
};


export default class CareNavBar extends LightningElement {
    lendLogo=LendWithCareImages+'/logo.png';
    LenwithCareLogo = LWCLogo;
    greenfield=greenfield;

    showGuestError = false;
    guestFName='';
    guestLName='';
    guestEmail='';
    termCheck=false;

    @track isMenuOpen = false;
    @track isSearchMenuOpen = false;
    @track isDropdownOpen = false;
    @track isDropdownOpenAbout = false;
    @track loginPage = false;
    violet=false;
    yellow=false;
    ham=Hamburger;
    MGlass=MagGlass;
    UseAvatar=UserIcons;
    UserAvatar=svgicons+'/personWhite.png'
    shopcart=ShoppingCart;
    UserSVG=UserSVG;
    showErrorMessage=false;
    cookieVal=[];
    isGuest = true;
    //care cart 	
    @api loanidfromparent=[];	
    @api carecart=false;	
    @api cartmodules;	
    step = 1;
    currentStep = "1";
    showSpinner;
    showFirstPage = true;
    showSecondPage = false;
    showThirdPage = false;
    Facebook = FbIcon;
    Google = GooIcon;
    Apple = AppIcon;
    AmericanExp = AExpress;
    CardCC = CC;
    CardVisa = VisaC;
    StripeCard = StripeC;

    firstPage=true;
    CartLendChangeChampion=false;
    CartChangeChampion=false;
    @api secondPage=false;
    @api thirdPage=false;
    @api fourthPage=false;
    @api fifthPage=false;
    createAccount=false;
    signIn=false;
    checkOutasGuest=false;
    cardPayment=false;
    paypalPayment=false;
    ThankYouAfterPayNow=false;
    CartModules=true;
    OpenThankyouPageWithNavBar=false;
    AvatarImg = LendWithCareImages+'/client1.png';
    @api apiLoanResults; // @api decorator to create a public property
    @track isOpen1 = false;
    @track searchTerm = '';
    @track loanResults;

    // for cart functionality
    testTotal=0;	
    supportOneMoreProject=false;	
    BorrowerFirstName='';	
    missingAmount=0;	
    FundedAmount=0;	
    GoalAmount=0;	
    progress=0;	
    amountFromParent="50";
    amountFromParent="50";
    @api amounttocart = 0;
    @track setTime = 0;	
    @track timeDuration = 2700000;//2700000	
    @track timerInterval;

    defaultDonationPercentage;	
    totalAmount = 0;	
    selectedAmounts = {};	
     totalCartAmount=0;	
    selectedPercentages = {};	
    totalcomboamount=0;	
    otherPercentage=false;	
    errorMessage=false;	
    OpenCCRedirectMessage=false;	
    donationDefaultValue= 0;	
    @api contactid;// = '0039D00000SzulBQAR';
    amountLeftToFullyFunded;	
    isAdded = false;	
    idsToDelete=[];	
    @api voluntaryDonation=false;	
    voluntaryDonationClosed = false;	
    amountZero =false;	
    indexToRemove;	
    @api LenderTopup=false;	
    sClosed=false;	
    errorMessageTopup=false;	
    @track donationAmount = 0;	
    @track topUpAmount = 0;	
    @api changeChampionTemplate = false;	
    rdData={};	
    RDid;	
    errorOnRDAmount =false;	
    otherRDAmount = false;	
    leasttocompleteLoanId;	
    leastToCompleteRecord={};	
    otherRDAmounts =0;	
    errorTransaction=false;	
    errorMessageOnTransaction;

    lenderBalanceAmount = 0;	
    remainingBalanceAmount = 0;	
    withLenderBalanceOnlyTemplate=false;	
    withLenderBalanceAndOthersTemplate=false;

    @track cart=[];

    noPostcode=true;
    noMobilePhone=true;
    usingLenderBalanceOnly = false;
    lenderEmail;
    lenderName;
    payByMethod='';

    firstAmount;
    secondAmount;
    thirdAmount;

    topupTranId;

    subscription = null;
    context = createMessageContext();
    guestCheckout = false;

    isLoading = false;


    get amounttocart(){
        return (this.loanidfromparent!=undefined && this.loanidfromparent.length >0 ? (this.loanidfromparent.length + (this.voluntaryDonation == true?1:0) ): 0) + 
        (this.changeChampionTemplate == true ? 1 : 0) +
        (this.LenderTopup == true ? 1 : 0) 
        ;
        //return this.amounttocart;
    }
    get totalNoOfCartItems(){
        this.amounttocart = (this.loanidfromparent? this.loanidfromparent.length : 0) + 
        (this.changeChampionTemplate == true ? 1 : 0) +
        (this.LenderTopup == true ? 1 : 0) +
        (this.voluntaryDonation == true?1:0);
        return this.amounttocart;
    }
    get AddedLenderTopup(){
        return this.topUpAmount? this.topUpAmount : 0;
    }

    get AddedChangeChampionAmount(){
        return this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0;
    }
    
    get totalLoansAndDonation(){

        if(this.voluntaryDonationClosed == false){
            let currentCartItemsTotalAmount =0;
                if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                    currentCartItemsTotalAmount = this.loanidfromparent
                    .filter(record => typeof record.selectedAmount === 'number')
                    .reduce((total, item) => total + item.selectedAmount,0);

                }

                let amt = (currentCartItemsTotalAmount * this.donationAmount)/100;
                return parseFloat(amt.toFixed(2));
         

        }
        else{
            return 0;
        }

        
    }

    get totalLoansOnly(){
        
        let currentCartItemsTotalAmount =0;
                if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                    currentCartItemsTotalAmount = this.loanidfromparent
                    .filter(record => typeof record.selectedAmount === 'number')
                    .reduce((total, item) => total + item.selectedAmount,0);

                }

                let amt = currentCartItemsTotalAmount + (currentCartItemsTotalAmount * this.donationAmount)/100 +
                (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) +
                (this.topUpAmount? this.topUpAmount : 0) ;
                return parseFloat(amt.toFixed(2));
         
    }


    resetCartVisible(){
                const closecartpage = true;
                //console.log(this.currentValueFromInput);
                const sentFromNavBar=new CustomEvent('fromnavbar',{detail:closecartpage});
                this.dispatchEvent(sentFromNavBar);
    }

    useLenderBalanceOnly(){
        //console.log('clicked from useLenderBalanceOnly ');
        this.payByMethod = 'Existing balance amount';
        this.usingLenderBalanceOnly = true;

        this.paymentToken = {};
        this.rdToken = {};
        this.createTokenForRd = false;
        this.cardPayment=false;
        this.paypalPayment=false;
        this.googlePayment=false;

        this.thirdPage=false;
        if(this.noPostcode && this.noMobilePhone){
            this.fifthPage=true;
            this.currentStep = "5";
            //this.totalLoansAndDonation();
            
        }
        else{
            this.fourthPage=true;
            this.currentStep = "4";
            
        }
    }
    lenderBalanceAndCard(){
        //console.log('clicked from lenderBalanceAndCard ')
        this.payByMethod = 'Existing amount/ Credit card';
    }
    lenderBalanceAndPaypal(){
        //console.log('clicked from lenderBalanceAndPaypal ')
        this.payByMethod = 'Existing amount/ Paypal';
    }

    closeErrorPopup(){	
    this.errorTransaction = false;	
    this.errorMessageOnTransaction = '';	
    }

    CCother(event){
        this.otherRDAmount=true;
        const selectedButton = event.target;
        // Remove the yellow background from all buttons
        const buttons = this.template.querySelectorAll('.voldonaButtons');
        buttons.forEach(button => {
            button.classList.remove('selected');
        });

        // Add the yellow background to the clicked button
        selectedButton.classList.add('selected');
    }


    otherRDAmountChange(event){
        if(event.target.value <10 ){
            this.errorOnRDAmount = true;
        }
        else{
            this.errorOnRDAmount = false;
            this.otherRDAmounts = event.target.value;
            
            this.subscribeCCCurrency(3,'Other', this.otherRDAmounts);
            localStorage.setItem( 'SelectedCCAmount', this.otherRDAmounts );
            this.calculateTotalSelectedAmount();
            // wait 3 seconds to call apex method
            if (this.timeout) {
            clearTimeout(this.timeout);
            }

            // Set a new timeout to call the Apex method after 3 seconds
            this.timeout = setTimeout(() => {
                //console.log('from otherRDAmountChange after 3 seconds')
                if(this.otherRDAmounts != null || this.otherRDAmounts != 0 || this.otherRDAmounts != undefined){
                    this.CCOtherAmount(this.otherRDAmounts);
                }
                
            }, 3000);
            }
    }

    @api 
    callChangeChampionFromParent(event){
        if(event ==this.firstAmount.replace('$', '')){
            this.CC35(event);
        }
        else if(event ==this.secondAmount.replace('$', '')){
            this.CC45(event);
        }
        else if(event ==this.thirdAmount.replace('$', '')){
            this.CC65(event);
        }

    }

    CCOtherAmount(otherAmount){
        
        const selectedButton = event.target;
        // Remove the yellow background from all buttons
        const buttons = this.template.querySelectorAll('.voldonaButtons');
        buttons.forEach(button => {
            button.classList.remove('selected');
        });

        // Add the yellow background to the clicked button
        selectedButton.classList.add('selected');

        //console.log('other amount from input box ', otherAmount, 'typeof - ', typeof(otherAmount))
        this.rdData['npe03__Amount__c']= Number(otherAmount);
        this.rdData['npe03__Contact__c'] = this.contactid;
        this.rdData['npsp__RecurringType__c'] = 'Open';
        this.rdData['PaymentMethod'] = 'Credit Card';
        this.rdData['CurrencyIsoCode'] = 'AUD';
        this.rdData['Payment_Gateway__c'] = 'Stripe';
        this.rdData['npsp__Day_of_Month__c'] = '16';
        this.rdData['npsp__PaymentMethod__c'] = 'Credit Card';

        //console.log('before currentCartItemsTotalAmount')
        this.showCreditCard = this.isshowCreditCard;;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
        
        
        this.rdAmount = this.rdData['npe03__Amount__c'];
        localStorage.setItem('rdAmt',this.rdData['npe03__Amount__c']);
        //console.log('after creating rd record with other amount ', JSON.stringify(this.rdData));

        let currentCartItemsTotalAmount =0;
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
            currentCartItemsTotalAmount = this.loanidfromparent
            .filter(record => typeof record.selectedAmount === 'number')
            .reduce((total, item) => total + item.selectedAmount,0);

        }

        this.testTotal = (this.rdData['npe03__Amount__c']? Number(this.rdData['npe03__Amount__c']) : 0) + 
        currentCartItemsTotalAmount + this.topUpAmount +
        (currentCartItemsTotalAmount * this.donationAmount)/100; /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
        this.testTotal = parseFloat(this.testTotal.toFixed(2));
    }
    subscribeCCCurrency(idx, curr, otherAmt){
        console.log('Inside subscribeCCCurrency', idx, curr, otherAmt);
        localStorage.setItem( 'SelectedCCIndex', idx );
        localStorage.setItem( 'isCC', true );
        localStorage.setItem( 'SelectedCCAmount', curr );
        var o = otherAmt != undefined ? true : false;
        localStorage.setItem('OtherChecked', o);
        console.log('Other:',otherAmt);
        const message2 = {
            messageToSend: 'BecomeChampionCurrChange',
            currentRecordId:idx,
            amountAddedToCart:curr
        };
        console.log('Publish2');
        publish(this.context, CARTMC, message2);
        console.log('OO:',otherAmt!=undefined);
        if( otherAmt!=undefined ){
            const message3 = {
                messageToSend: 'BecomeChampionOtherCurrChange',
                currentRecordId:otherAmt
            };
            console.log('Publish 3');
            publish(this.context, CARTMC, message3); 
        }
        const message = {
            messageToSend: 'BecomeChampionAddToCart'
        };
        console.log('Publish1');
        publish(this.context, CARTMC, message);
    }

    CC35(event){
        
        const selectedButton = event.target;
        // Remove the yellow background from all buttons
        const buttons = this.template.querySelectorAll('.voldonaButtons');
        buttons.forEach(button => {
            button.classList.remove('selected');
        });

        // Add the yellow background to the clicked button
        selectedButton.classList.add('selected');

        this.otherRDAmount=false;
        this.errorOnRDAmount =false;
        this.rdData['npe03__Amount__c'] = this.firstAmount.replace('$', '');
        this.rdData['npe03__Contact__c'] = this.contactid;
        this.rdData['npsp__RecurringType__c'] = 'Open';
        this.rdData['PaymentMethod'] = 'Credit Card';
        this.rdData['CurrencyIsoCode'] = 'AUD';
        this.rdData['Payment_Gateway__c'] = 'Stripe';
        this.rdData['npsp__Day_of_Month__c'] = '16';
        this.rdData['npsp__PaymentMethod__c'] = 'Credit Card';

        //console.log('before currentCartItemsTotalAmount')

        let currentCartItemsTotalAmount =0;
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
            currentCartItemsTotalAmount = this.loanidfromparent
            .filter(record => typeof record.selectedAmount === 'number')
            .reduce((total, item) => total + item.selectedAmount,0);

        }
        //console.log('before currentCartItemsTotalAmount')
        
        this.testTotal = (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) + 
        currentCartItemsTotalAmount + this.topUpAmount+
        (currentCartItemsTotalAmount * this.donationAmount)/100; /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
        
        this.showCreditCard = this.isshowCreditCard;;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;


        console.log('before this.rdData[npe03__Amount__c] ',this.rdData['npe03__Amount__c'])
        console.log('before this.currentCartItemsTotalAmount ',currentCartItemsTotalAmount)
        console.log('before this.topUpAmount ',this.topUpAmount)
        console.log('before this.donationAmount ',this.donationAmount)

        //this.testTotal = parseFloat(this.testTotal.toFixed(2));
        console.log('before creating rd record 517 ', JSON.stringify(this.rdData));
       
        console.log('Calling sCurr');
        try{
            console.log('Calling Amt',this.rdData['npe03__Amount__c']);
            var amt = this.rdData['npe03__Amount__c']!=undefined ? (Number)(this.rdData['npe03__Amount__c']) : 0;
            localStorage.setItem('rdAmt',amt);
            console.log('Called sCurr');
            //this.rdAmount = (Number)(this.rdData['npe03__Amount__c']);
            console.log('Called sCurr');
            this.subscribeCCCurrency(0,this.firstAmount);

        } catch( er ){
            console.log(er)
        }

    }
    CC45(event){
        
        const selectedButton = event.target;
        // Remove the yellow background from all buttons
        const buttons = this.template.querySelectorAll('.voldonaButtons');
        buttons.forEach(button => {
            button.classList.remove('selected');
        });

        // Add the yellow background to the clicked button
        selectedButton.classList.add('selected');

        this.otherRDAmount=false;
        this.errorOnRDAmount =false;
        this.rdData['npe03__Amount__c']=this.secondAmount.replace('$', '');
        
        this.rdData['npe03__Contact__c'] = this.contactid;
        this.rdData['npsp__RecurringType__c'] = 'Open';
        this.rdData['PaymentMethod'] = 'Credit Card';
        this.rdData['CurrencyIsoCode'] = 'AUD';
        this.rdData['Payment_Gateway__c'] = 'Stripe';
        this.rdData['npsp__Day_of_Month__c'] = '16';
        this.rdData['npsp__PaymentMethod__c'] = 'Credit Card';

        let currentCartItemsTotalAmount =0;
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
            currentCartItemsTotalAmount = this.loanidfromparent
            .filter(record => typeof record.selectedAmount === 'number')
            .reduce((total, item) => total + item.selectedAmount,0);

        }
        this.testTotal = (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) + 
        currentCartItemsTotalAmount + this.topUpAmount +
        (currentCartItemsTotalAmount * this.donationAmount)/100; /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
        //this.testTotal = parseFloat(this.testTotal.toFixed(2));

        this.showCreditCard = this.isshowCreditCard;;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;

        console.log('before creating rd record 45 ', JSON.stringify(this.rdData));
        
        localStorage.setItem('rdAmt',this.rdData['npe03__Amount__c']);
        this.rdAmount = this.rdData['npe03__Amount__c'];
        this.subscribeCCCurrency(1,this.secondAmount);
    }
    CC65(event){
        
        const selectedButton = event.target;
        // Remove the yellow background from all buttons
        const buttons = this.template.querySelectorAll('.voldonaButtons');
        buttons.forEach(button => {
            button.classList.remove('selected');
        });

        // Add the yellow background to the clicked button
        selectedButton.classList.add('selected');

        //console.log('clicked 65 cc ')
        this.otherRDAmount=false;
        this.errorOnRDAmount =false;
        this.rdData['npe03__Amount__c']=this.thirdAmount.replace('$', '');;
        
        this.rdData['npe03__Contact__c'] = this.contactid;
        this.rdData['npsp__RecurringType__c'] = 'Open';
        this.rdData['PaymentMethod'] = 'Credit Card';
        this.rdData['CurrencyIsoCode'] = 'AUD';
        this.rdData['Payment_Gateway__c'] = 'Stripe';
        this.rdData['npsp__Day_of_Month__c'] = '16';
        this.rdData['npsp__PaymentMethod__c'] = 'Credit Card';
        

        let currentCartItemsTotalAmount =0;
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
            currentCartItemsTotalAmount = this.loanidfromparent
            .filter(record => typeof record.selectedAmount === 'number')
            .reduce((total, item) => total + item.selectedAmount,0);

        }
        this.testTotal = (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) + 
        currentCartItemsTotalAmount + 
        this.topUpAmount + (currentCartItemsTotalAmount * this.donationAmount)/100;/* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
        //this.testTotal = parseFloat(this.testTotal.toFixed(2));

        this.showCreditCard = this.isshowCreditCard;;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;

        console.log('before creating rd record 65 ', JSON.stringify(this.rdData));
        
        localStorage.setItem('rdAmt',this.rdData['npe03__Amount__c']);
        this.rdAmount = this.rdData['npe03__Amount__c'];
        this.subscribeCCCurrency(2,this.thirdAmount);

    }


    calculateTotalAmount(){
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
            const loanTotal = this.loanidfromparent
            .filter(record => typeof record.selectedAmount === 'number')
            .reduce((total, loanItem) => total + loanItem.selectedAmount, 0);
            const donationAmount1 = (this.donationAmount / 100) * loanTotal;
            return loanTotal + donationAmount1 + parseFloat(this.topUpAmount) + 50; // Add $50 fixed amount
        } else{
            return parseFloat(this.topUpAmount) + 50;
        }
    }

    closeVoluntaryDonation(){
        
            removeTransactionRecord({idToRemove:this.pageData['Id']})
            .then(result=>{
                console.log('delete vd record ', JSON.stringify(result))
                localStorage.setItem('isVoluntary',false);
                this.pageData['Id'] = '';
                this.voluntaryDonation = false;
                this.voluntaryDonationClosed = true;
                let currentCartItemsTotalAmount =0;
                if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                        currentCartItemsTotalAmount = this.loanidfromparent
                        .filter(record => typeof record.selectedAmount === 'number')
                        .reduce((total, item) => total + item.selectedAmount,0);

                    }

                    this.testTotal =  currentCartItemsTotalAmount + 
                    (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
                    + this.topUpAmount;
                    /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
                    this.donationAmount = 0;
                    this.testTotal = parseFloat(this.testTotal.toFixed(2));
                })
            .catch(error=>{
                console.log('error while deleting vd ', JSON.stringify(error))
            })

             
    }

    closeLenderTopup(){
        this.LenderTopup=false;
        this.LenderTopupClosed = false;
        let currentCartItemsTotalAmount =0;
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }

            this.testTotal =  currentCartItemsTotalAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
             + (currentCartItemsTotalAmount * this.donationAmount)/100;/* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
             this.topUpAmount = 0;
             this.testTotal = parseFloat(this.testTotal.toFixed(2));
            localStorage.setItem('isTopup',false);
            localStorage.setItem('TopupTransactionId',null);
            localStorage.setItem('topupAmountfromStorage',0);            
        if(this.TopupTransactionId!='' || this.TopupTransactionId!=null || this.TopupTransactionId!=undefined){
            removeTransactionRecord({idToRemove:this.TopupTransactionId})
            .then(result=>{
                //console.log('result from apex after delete ', JSON.stringify(result))
                /*this.totalCartAmount = this.totalCartAmount - this.loanidfromparent[this.indexToRemove].selectedAmount;
                console.log('current deleting items amount ',this.loanidfromparent[this.indexToRemove].selectedAmount)
                console.log('after delete items total amount ',this.totalCartAmount)*/

                this.TopupTransactionId = null

                })
            .catch(error=>{
                console.log('error while deleting ', JSON.stringify(error))
            })
        }
        
    }
    topupData = {};
    errorMessageTopupNull=false;
    errorMessageTopupkKYCPending = false;
    TopupTransactionId;
    delayTimeout;
    lenderTopupAmountChanges(event){
        console.log(typeof(event.target.value))
        
        if(event.target.value <2 ){
            this.errorMessageTopup = true;
            this.errorMessageTopupNull=false;
            this.errorMessageTopupkKYCPending = false;
            this.topUpAmount = Number(event.target.value);
            let currentCartItemsTotalAmount =0;
            if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }

            this.testTotal =  currentCartItemsTotalAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
             + (currentCartItemsTotalAmount * this.donationAmount)/100; /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
             this.testTotal = parseFloat(this.testTotal.toFixed(2));
            
        }
        else{
            this.errorMessageTopup = false;
            this.errorMessageTopupNull=false;
            this.errorMessageTopupkKYCPending = false;
            this.topUpAmount = Number(event.target.value);
            let currentCartItemsTotalAmount =0;
            if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }

            this.testTotal = this.topUpAmount + currentCartItemsTotalAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
             + (currentCartItemsTotalAmount * this.donationAmount)/100; /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
            this.testTotal = parseFloat(this.testTotal.toFixed(2));


            
               // Clear the previous timeout (if any)
                clearTimeout(this.delayTimeout);
                console.log('537 line ')
                this.delayTimeout = setTimeout(() => {
                // This code will execute after the delay
                this.topupData['Lender__c'] = this.contactid;
                this.topupData['Amount__c'] = this.topUpAmount;
                this.topupData['Type__c'] = 'Topup';
                if(this.topupData['Id'] != null && this.topupData['Id'] != 'null' 
                && this.topupData['Id'] != undefined && this.topupData['Id'] != 'undefined'){
                    this.topupData['Id'] = this.topupData['Id'];
                }
                console.log('before apex ', this.topupData);
                TopupTransactionRecords({TopupRecord:this.topupData})
                .then(result => {
                    console.log('result from topup ', result);
                    
                    if(result == null){
                        this.errorMessageTopupNull = true;
                        this.errorMessageTopupkKYCPending = false;
                    }
                    else if(result == 'KYC Pending'){
                        this.errorMessageTopupkKYCPending = true;
                         this.errorMessageTopupNull = false;
                    }
                    else if(JSON.stringify(result).length >=15 ||JSON.stringify(result).length >=18){
                        this.TopupTransactionId = JSON.stringify(result);
                        this.TopupTransactionId = result;
                        this.topupData['Id'] = result;
                        localStorage.setItem('TopupTransactionId', this.TopupTransactionId);
                        localStorage.setItem('topupAmountfromStorage', this.topupData['Amount__c']);
                        localStorage.setItem('isTopup', true);
                    }
                    //this.topupTranId = result[0].Id;
                    
                })
                .catch(error => {
                    console.log('error topup ', JSON.stringify(error))
                })
            }, 3000);
        }
        
    }
    pageData={}

    addLeastAmountToTotal(){
        //console.log('inside function ')
       
        if(this.isAdded != true){
            
            //console.log('inside if ')
            this.totalCartAmount = this.totalCartAmount + this.amountLeftToFullyFunded;
            
            this.FundedAmount = this.FundedAmount + this.amountLeftToFullyFunded;
            this.progress = (this.FundedAmount / this.GoalAmount) * 100;
            //console.log('426 ')
            let currentCartItemsTotalAmount1 =0;
            //console.log('428 ')
            //console.log('this.loanidfromparent.length ', typeof(this.loanidfromparent))
            if(this.loanidfromparent != undefined){
                if(this.loanidfromparent!=undefined && this.loanidfromparent.length > 0 ){
                    //console.log('429 ')
                currentCartItemsTotalAmount1 = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

                }
                
            }
            //console.log('434 ')
            this.testTotal = this.topUpAmount + currentCartItemsTotalAmount1 + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
             + (currentCartItemsTotalAmount1 * this.donationAmount)/100;//s + (this.isAdded ? this.amountLeftToFullyFunded : 0);
            
            //console.log('440 ')
            



            //console.log('pageData starts ')
            //this.pageData['Lender__c'] = this.contactid;
            this.pageData['Amount__c'] = this.amountLeftToFullyFunded;
            this.pageData['Type__c'] = 'Loan';
            this.pageData['Loan__c'] = this.leasttocompleteLoanId;
            //console.log('450 ')

            console.log('this pagedata to apex ', JSON.stringify(this.pageData))

            const currentPageData = [this.pageData];
            console.log('455 ')
            createTransactionRecord({recordsToInsert: currentPageData})
            .then(result => {
                 console.log('result ', JSON.stringify(result));
                 //console.log('currentRecordItem.TransactionId after result ', result[0].Id);
                 this.pageData['TransactionId'] = result[0].Id;
                  if(result[0].Id.length >=15 || result[0].Id.length>=18){
                        this.startTimer();
                        this.isAdded = true;
                        this.supportOneMoreProject = false;
                        localStorage.setItem('isAdded',this.supportOneMoreProject);
                        
                        this.leastToCompleteRecord ={...this.leastToCompleteRecord, TransactionId:result[0].Id};
                        //this.leastToCompleteRecord['TransactionId'] = result[0].Id;
                        //console.log('this.leastToCompleteRecord.TransactionId ', this.leastToCompleteRecord['TransactionId'])
                        this.leastToCompleteRecord['selectedAmount'] = this.amountLeftToFullyFunded;
                        //console.log('this.leastToCompleteRecord.selectedAmount ', this.leastToCompleteRecord['selectedAmount'])
                        this.loanidfromparent = [...this.loanidfromparent, this.leastToCompleteRecord];
                        //console.log('currentRecordItem after copying from least record ', this.loanidfromparent )
                  
                        localStorage.setItem('myArray', JSON.stringify(this.loanidfromparent));

                            let currentCartItemsTotalAmount =0;
                        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                            currentCartItemsTotalAmount = this.loanidfromparent
                            .filter(record => typeof record.selectedAmount === 'number')
                            .reduce((total, item) => total + item.selectedAmount,0);

                        }
                        //console.log('currentCartItemsTotalAmount ',currentCartItemsTotalAmount);
                        //console.log('currentCartItemsTotalAmount ',typeof(currentCartItemsTotalAmount));
                        this.testTotal = this.topUpAmount + currentCartItemsTotalAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
                        + (currentCartItemsTotalAmount * this.donationAmount)/100;
                            this.testTotal = parseFloat(this.testTotal.toFixed(2));
                            //this.addLeastAmountToTotal = false;
                            
                    }
            })
            .catch(error =>{
                //console.log('error from transaction record insert ', JSON.stringify(error))
                //console.log('error.body.pageErrors[0].message ', error.body.pageErrors[0].message)
                this.errorTransaction = true;
                this.errorMessageOnTransaction = error.body.pageErrors[0].message;
                this.FundedAmount = this.FundedAmount - this.amountLeftToFullyFunded;
                this.progress = (this.FundedAmount / this.GoalAmount) * 100;
        
    })

        }
        

    }



haveLenderBalance = false;
@wire(getLenderBalance, {conId: '$contactid'})
wiredLenderBalance(lenderValue){
    const {data, error} = lenderValue;
    console.log('returned records fromn getLenderBalance ', JSON.stringify(lenderValue));
        if (data) {
            this.lenderBalanceAmount = data.Lender_Balance__c;
            this.noMobilePhone = data.MobilePhone ? true : false;
            this.noPostcode = data.Postcode__c ? true : false;
            this.lenderEmail = data.Email?data.Email: 0;
            this.lenderName = data.Name;
            this.haveLenderBalance = data.Lender_Balance__c > 0 ? true:false;
            if(this.lenderBalanceAmount < 0){
                this.showCreditCard = this.isshowCreditCard;
                this.showPaypal = this.isshowPaypal;
                this.showApplePay = this.isshowApplePay;
                this.showGooglePay = this.isshowGooglePay;
            }
            //console.log('this.lenderBalanceAmount ', this.lenderBalanceAmount)
        }else if (error) {
            //console.log('Error occured from getLenderBalance' + JSON.stringify(error));
        }

}
//this.supportOneMoreProject=true;
@wire(getLeastToCompleteLoanRecord)
    wireddata(pageValue) {
        const { data, error } = pageValue;
      //console.log('returned records fromn getLeastToCompleteLoanRecord before data' );
        if (data) {
            console.log('returned records fromn getLeastToCompleteLoanRecord', JSON.stringify(data));
            this.leastToCompleteRecord = data;
            this.leasttocompleteLoanId = data.Id;
            
            this.BorrowerFirstName=data.Borrower__r?data.Borrower__r.FirstName:'';
            this.missingAmount=data.Amount_Left_Before_Fully_Funded__c;
            this.FundedAmount=data.Amount_Funded__c;
            this.GoalAmount=data.Published_Amount_AUD__c!=undefined?Number(data.Published_Amount_AUD__c).toFixed(2):data.Published_Amount_AUD__c;
            this.progress = (data.Amount_Funded__c / data.Published_Amount_AUD__c) * 100,
            this.amountLeftToFullyFunded = parseFloat(data.Amount_Left_Before_Fully_Funded__c.toFixed(2));
       
        } else if (error) {
            console.log('Error occured from least record' + JSON.stringify(error));
        }
    }
    @api calculateTotalSelectedAmount() {
        //if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
            let amount = 0;
            if( this.loanidfromparent!=undefined && this.loanidfromparent.length>0 ){
                amount = this.loanidfromparent.filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, record) => {
                    return total + record.selectedAmount;
                }, 0);
            }
            //this.testTotal = Number(amount);
            var isCC = localStorage.getItem('isCC')
            console.log('REM987:',this.changeChampionTemplate, isCC);
            if( isCC!= undefined && isCC!= 'undefined' && isCC != 'false'){
                this.rdData['npe03__Amount__c'] = localStorage.getItem('SelectedCCAmount');
                this.rdData['npe03__Amount__c'] = this.rdData['npe03__Amount__c'].replace('$','');
            }
            console.log('TOTALLLL:',this.rdData['npe03__Amount__c'], localStorage.getItem('SelectedCCAmount'), localStorage.getItem('isCC'));
            this.testTotal = parseFloat(amount.toFixed(2)) + (this.voluntaryDonation ? (parseFloat(amount.toFixed(2)) * Number(this.donationAmount)/100):0)
            + (this.LenderTopup == true ? this.topUpAmount :0) 
            + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0);
            //console.log('parseFloat(amount).toFixed(2)--> '+parseFloat(amount.toFixed(2)))
            this.testTotal = parseFloat(this.testTotal.toFixed(2));
        //}
    }
    @api calculateTotalAmount() {
        
        //console.log('calculateTotalAmount starts ')
        let currentCartItemsTotalAmount =0;
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
            currentCartItemsTotalAmount = this.loanidfromparent
            .filter(record => typeof record.selectedAmount === 'number')
            .reduce((total, item) => total + item.selectedAmount,0);

        }
        //console.log('before currentCartItemsTotalAmount')
        
        this.testTotal = (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) + 
        currentCartItemsTotalAmount + this.topUpAmount +
        (currentCartItemsTotalAmount * this.donationAmount)/100;/* + 
        (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
        this.testTotal = parseFloat(this.testTotal.toFixed(2));
        //console.log('before currentCartItemsTotalAmount ends ')
        //console.log('calculatetotalCartAmount--> '+this.totalCartAmount)
    }
    renderedCallback(){
        //console.log('k1');
        if(!this.rendered){
            if( this.signInCC ){
            var isCC = localStorage.getItem('isCC')
            if( isCC!= undefined && isCC!= 'undefined' && isCC != 'true'){
                this.checkPreviousChangeChampion();
            }
            }
            if(localStorage.getItem('isCC') != 'undefined' && localStorage.getItem('isCC')!=undefined
            && localStorage.getItem('isCC')!='false'){
                this.changeChampionTemplate = true;
                console.log('rendered call back this.changeChampionTemplate = true; ')
                this.amounttocart = (this.loanidfromparent!=undefined && this.loanidfromparent.length >0 ? (this.loanidfromparent.length + (this.voluntaryDonation == true?1:0) ): 0) + 
                (this.changeChampionTemplate == true ? 1 : 0) +
                (this.LenderTopup == true ? 1 : 0) ;
                console.log('AMT:',this.amounttocart);
                this.rendered = true;
            } 
            if(this.totalCartAmount > 0){
                this.amountZero=false;
            }

            this.rendered = true;
            
        }
        
            
        
      const progressBarElements = this.template.querySelectorAll('.progressBarInner1');
    // Fetch your JSON data here (e.g., using fetch, import, or received from parent component)

    // Loop through each progress bar element and set its styles based on JSON data
    progressBarElements.forEach((progressBar) => {
      const progressValue = progressBar.dataset.value;
      //console.log('from test nave bar rendred call back ', progressValue)
      progressBar.style.width = progressValue + "%";
      if (progressValue < 85) {
        progressBar.style.backgroundColor = "#FEBE10";
      } else {
        progressBar.style.backgroundColor = "#5C8F39";
      }
    });
  }
  rendered = false;
  checkPreviousChangeChampion(){
    setTimeout( ()=>{
        console.log('Inside rendered', localStorage.getItem('isCC'), localStorage.getItem('SelectedCCIndex'),localStorage.getItem('SelectedCCAmount'),localStorage.getItem('OtherChecked') );
        if( localStorage.getItem('isCC') != 'undefined' && localStorage.getItem('isCC')!=undefined
         && localStorage.getItem('isCC')!='false'){
            this.changeChampionTemplate = true;
            console.log('999')
            var selIdx = localStorage.getItem('SelectedCCIndex');
            var isCC = localStorage.getItem('isCC');
            var selAmt = localStorage.getItem('SelectedCCAmount');
            this.otherRDAmount = localStorage.getItem('OtherChecked') == 'true';
            this.otherRDAmounts = selAmt;
            /* this.selectedCurrency = selAmt;
            this.selectedCurr = selAmt; */
            // this.selectedIndex = Number(selIdx);
            // console.log('Valuess:',this.CchampionButton, this.selectedCurrency, this.selectedIndex);
            if( selIdx!=undefined ){
                var ele = this.template.querySelectorAll('.voldonaButtons');
                for( var e of ele ){
                    e.classList.remove( 'selected' );
                }
                console.log('ValuessEle:',JSON.parse(JSON.stringify(ele)));
                console.log('ValuessEle:',ele.length);
                console.log('ValuessEle:',selIdx);
                if( selIdx != undefined && ele != undefined ){
                    if( ele.length > selIdx ){
                        var element = ele[selIdx];
                        console.log('ValuessElement:',ele);
                        console.log('ValuessElement:',element);
                        console.log('ValuessElement:',JSON.parse(JSON.stringify(element)));
                        console.log('ValuessElement:',JSON.parse(JSON.stringify(ele)));
                        element.classList.add( 'selected' );
                    }
                }
            }
            var ele = this.template.querySelectorAll('.voldonaButtons');
            if(ele!=undefined && ele.length>0){  
                this.rendered = false;
                this.signInCC = false; 
            }
        } else{
            this.changeChampionTemplate = false;
        }

    }, 0 );
  }
  CloseCCRedirectMessage(){
        this.OpenCCRedirectMessage=false;
    }
    ok(){
        //this.OpenCCRedirectMessage=false;
        this.changeChampionTemplate=true;
        //this.firstPage=false;
        this.OpenCCRedirectMessage=false;
        this.secondPage=false;
        //this.createAccount=true;
        this.currentStep = "1";
        this.CartLendChangeChampion=false;
        this.CartChangeChampion=false;
        this.CC35();
    }
    cancel(){
        this.OpenCCRedirectMessage=false;
        this.secondPage=false;
        this.checkOutasGuest=false;
        this.createAccount=false;
        this.signIn=false;
        this.thirdPage=true;
        this.currentStep = "3";
        this.firstPage=false;
    }
    publishMC(loanId) {
        const message = {
            messageToSend: 'NavBar',
            currentRecordId:loanId
        };
        //console.log('OUTPUT : ',message.currentRecordId);
        publish(this.context, CARTMC, message);
    }
    removeCurrentLoan(event){
        console.log('REM1144:',this.changeChampionTemplate);
        //console.log('before loanidfromparent ', JSON.stringify(this.loanidfromparent))
        this.indexToRemove = Number(event.target.dataset.id);
        //console.log('current records transaction id ', this.loanidfromparent[this.indexToRemove].TransactionId);

        const deleteFromParentComponent = new CustomEvent('delete', {
            detail: {
                    TransactionId: this.loanidfromparent[this.indexToRemove].TransactionId,
                    selectedAmount: this.loanidfromparent[this.indexToRemove].selectedAmount
                }
        });

        this.dispatchEvent(deleteFromParentComponent);
        var lId = this.loanidfromparent[this.indexToRemove].Id;
        if(this.loanidfromparent[this.indexToRemove].TransactionId != undefined){
            console.log('REM1159:',this.changeChampionTemplate);

            //const currentTransactionId = [this.loanidfromparent[indexToRemove].TransactionId];
            removeTransactionRecord({idToRemove:this.loanidfromparent[this.indexToRemove].TransactionId})
            .then(result=>{
                console.log('REM1164:',this.changeChampionTemplate);

                //console.log('result from apex after delete ', JSON.stringify(result))
                /*this.totalCartAmount = this.totalCartAmount - this.loanidfromparent[this.indexToRemove].selectedAmount;
                console.log('current deleting items amount ',this.loanidfromparent[this.indexToRemove].selectedAmount)
                console.log('after delete items total amount ',this.totalCartAmount)*/

                

                })
            .catch(error=>{
                console.log('error while deleting ', JSON.stringify(error))
            })
        }
        if (!isNaN(this.indexToRemove)) {
            //console.log('inside isnan if ')
            if (this.loanidfromparent!=undefined && this.indexToRemove >= 0 && this.indexToRemove < this.loanidfromparent.length) {
                //console.log('inside next if and before splice ')
                this.loanidfromparent = this.loanidfromparent.filter((item, index) => index !== this.indexToRemove); // Remove 1 element at the specified index
                localStorage.setItem('myArray', JSON.stringify(this.loanidfromparent));
                //console.log('after slice if this.loanidfromparent ', )
                if(this.loanidfromparent.length == 0){
                this.stopTimer();
                this.voluntaryDonation = false;
                localStorage.setItem('isVoluntary',false);
        
                localStorage.setItem('vdId',null);
                
                }
                console.log('REM1193:',this.changeChampionTemplate);
                
                let currentCartItemsTotalAmount =0;
                if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                    currentCartItemsTotalAmount = this.loanidfromparent
                    .filter(record => typeof record.selectedAmount === 'number')
                    .reduce((total, item) => total + item.selectedAmount,0);

                }

                

                this.testTotal = this.topUpAmount + currentCartItemsTotalAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
                + (currentCartItemsTotalAmount * this.donationAmount)/100;/* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
                this.testTotal = parseFloat(this.testTotal.toFixed(2))
                this.publishMC(lId);
                this.createDonationTransRecord();
                //this.loanidfromparent = [...this.loanidfromparent]; // Trigger reactivity

                
            }
            
            
        }
        //console.log('after loanidfromparent ', JSON.stringify(this.loanidfromparent))
        
    }
    updateData ={};
    cartIndex;
    handleChangeSelect(event) {
        
        
        const itemId = this.loanidfromparent[event.target.dataset.id].TransactionId;
        //console.log('clicked items TransactionId ', itemId);

        // Find the clicked item index in the array
        this.cartIndex = this.loanidfromparent.findIndex(item => item.TransactionId === itemId);
        //console.log('itemIndex ', this.cartIndex)

        this.updateData['Amount__c'] = Number(event.target.value);
        this.updateData['Id'] = itemId;

        
        updateTransactionRecord({rec:this.updateData})
        .then(result => {
            //console.log('result from update records amount ', JSON.stringify(result));
            //console.log('before this.loanidfromparent[this.cartIndex] ', JSON.stringify(this.loanidfromparent[this.cartIndex]));
            this.loanidfromparent = this.loanidfromparent.map((loan, index) => {
                if (index === this.cartIndex) {
                    return {
                        ...loan,
                        Funded__c: result.Amount__c, selectedAmount : result.Amount__c // Replace with the new value you want to set
                    };
                }
                return loan;
            });
            //console.log('after result from apex ', JSON.stringify(this.loanidfromparent[this.cartIndex]));

            this.calculateTotalAmount();
            this.createDonationTransRecord();
        })
        .catch(error => {
            console.log('error updating transaction recd ', JSON.stringify(error))
            this.errorTransaction = true;
            this.errorMessageOnTransaction = error.body.pageErrors[0].message;
        })

        
    }
    pageData={};
    totalVDAmount=0;
    VoluntaryDonationChange(event){
        this.defaultDonationPercentage = Number(event.detail.value);
        this.donationAmount = Number(event.detail.value);
        if(event.target.value != 'Other' && this.donationAmount != 0){
            this.otherPercentage = false;
            
            //console.log('before foreach')
            let totalSelectedAmount = this.totalCartAmount;
            //console.log('before calculation  ')
            
            let currentCartItemsTotalAmount =0;
            if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }
            //console.log('currentCartItemsTotalAmount ',currentCartItemsTotalAmount);
            this.testTotal = currentCartItemsTotalAmount + (currentCartItemsTotalAmount) * Number(event.target.value)/100 
            + this.topUpAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) ;
            /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
            this.testTotal = parseFloat(this.testTotal.toFixed(2))
            this.totalVDAmount = (currentCartItemsTotalAmount) * Number(event.target.value)/100;

            this.createDonationTransRecord();



        }
        else if(this.donationAmount == 0){
            if(this.pageData['Id'] != null){
                removeTransactionRecord({idToRemove:this.pageData['Id']})
                .then(result=>{
                    console.log('after deleting 0 vd trans ', result);
                    this.pageData['Id'] = null;
                    this.calculateTotalSelectedAmount();
                    })
                .catch(error=>{
                    console.log('error while deleting vd ', JSON.stringify(error))
                })

            }
            
        }
        else{
            this.otherPercentage = true;
        }
        
        
    }

    @api createDonationTransRecord(){
            console.log('from vd rec creating')
            console.log('REM1317:',this.changeChampionTemplate);

            let currentCartItemsTotalAmount =0;
            if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }
            if(this.contactid != null || this.contactid != undefined){
                this.pageData['Lender__c'] = this.contactid;
            }
            if(this.pageData['Id'] != '' && this.pageData['Id'] != null && 
            this.pageData['Id'] != undefined && this.pageData['Id'] != 'null'){
            this.pageData['Id'] = this.pageData['Id'];
            }
            this.pageData['Lender__c'] = this.contactid;
            this.pageData['Amount__c'] = (currentCartItemsTotalAmount) * Number(this.defaultDonationPercentage)/100; 
            this.pageData['Type__c'] = 'Donation';
            
            if(this.pageData['Amount__c'] > 0){
                createVDTransaction({rec: this.pageData})
                .then(result => {
                    if(result.Id.length >=15 || result.Id.length>=18){
                        localStorage.setItem('vdId', result.Id);
                        this.pageData['Id'] = result.Id;
                        console.log('creating vd trans ', JSON.stringify(result));
                        console.log('REM1344:',this.changeChampionTemplate);

                        this.calculateTotalSelectedAmount();
                    }
                })
                .catch(error => {
                    console.log('error creating voluntary donation transaction record ', JSON.stringify(error));
                    localStorage.setItem('vdId', null);
                    this.pageData['Id'] = null;
                })
            }
            
            

    }

    endsWith5Or0(number) {
    return number % 10 === 0 || number % 10 === 5;
    }


    otherPercentageChange(event){
        
        this.donationAmount = event.target.value;
       
        if (this.endsWith5Or0(event.target.value) && event.target.value>25) {
            this.errorMessage=false;
            //this.totalCartAmount=this.calculateTotalSelectedAmount() + ((this.calculateTotalSelectedAmount() * event.target.value)/100);
            let currentCartItemsTotalAmount =0;
            if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }
            this.testTotal = currentCartItemsTotalAmount + (currentCartItemsTotalAmount * this.donationAmount)/100 
            + this.topUpAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) ;/* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
            this.testTotal = parseFloat(this.testTotal.toFixed(2))
        } else {
            this.errorMessage=true;
            let currentCartItemsTotalAmount =0;
            if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }
            this.testTotal = currentCartItemsTotalAmount + (currentCartItemsTotalAmount * 0)/100 
            + this.topUpAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) ;/* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
            this.testTotal = parseFloat(this.testTotal.toFixed(2));
        }
                
    }
   

    @wire(LWCConfigSettingMetadata)
    wiredDataOfLWCConfigSettingMetadata({ error, data }) {
      if (data) {
          this.defaultDonationPercentage = (data.Default_Donation_at_Checkout__c).toString();
          this.donationAmount = this.defaultDonationPercentage;
          
          if(this.loanidfromparent!=undefined && this.loanidfromparent.length>0 && this.donationAmount>0){
            this.calculateTotalSelectedAmount();
            }
          const currencies = data.Change_Champion_Currencies__c.split(',');
            //console.log('cur--> ', currencies)
          this.firstAmount = currencies[0];
          this.secondAmount = currencies[1];
          this.thirdAmount = currencies[2];
        //console.log('Data from LWCConfigSettingMetadata ', JSON.stringify(data));
        //console.log('defaultDonationPercentage ', this.defaultDonationPercentage);
      } else if (error) {
         console.error('Error:LWCConfigSettingMetadata ', error);
      }
    }

   

    get arrowIcon() {
        return this.isOpen1 ? '∧' : '∨';
    }

    toggleSection() {
        this.isOpen1 = !this.isOpen1;
    }


    handleInputChange(event) {
        this.searchTermRaw = event.target.value;
        // Clear the previous debounce timer if it exists
        this.searchTerm = this.searchTermRaw.toLowerCase();

        if (this.searchTerm){
            this.showErrorMessage=false;
        }
       

    }

    handleKeyUp(event) {
        // Check if the Enter key (key code 13) was pressed
        if (event.keyCode === 13) {
            this.searchLoans();
        }
    }

    searchLoans() {

        // Check if the search term is empty before calling the Apex method
        if (!this.searchTerm) {
            this.apiLoanResults = null;
            this.showErrorMessage=true; // Clear the results when the search term is empty
            return;
        }

        //console.log('Capitalize SearchTerm--->'+this.searchTerm);

        searchLoan({ searchKey: this.searchTerm })
            .then(result => {
                this.apiLoanResults = result;
                //console.log('Search Results -->', JSON.stringify(this.apiLoanResults));

                if (this.apiLoanResults) {
                    window.location.assign('-caresearchresults?searchTerm=' + this.searchTerm);
                } else {
                    console.log('No Data has been fetched');
                }

            })
            .catch(error => {
                console.log(error);
            });
    }




    get searchBg(){
        return `background-image: url('${this.greenfield}');background-size: cover; background-repeat: no-repeat;`;
    }
/*
    openViewAllloans() {
        window.location.href = 'https://careaustralia--mfadev.sandbox.my.site.com/LendwithCare/s/careviewallloans';
    }
*/
    openCartPage(){
        this.carecart=true;
        //document.body.classList.add('removeOverflow');
        this.checkGuestUser();
        this.overflowFalse();
        
    }
    closeCartPage(){
        this.setPaymentMethods();
        this.paymentToken = {};
        this.rdToken = {};
        this.createTokenForRd = false;
        this.cardPayment=false;
        this.paypalPayment=false;
        this.googlePayment=false;

        if(this.currentStep == "2"){
            if( this.isGuest ){
                this.currentStep = "1";
                this.firstPage=true;
                this.secondPage=false;
                this.checkOutasGuest = false;
                this.guestCheckout = true;
            }
            if( !this.isGuest ){
                this.firstPage=true;
                this.secondPage=false;
                this.currentStep = "1";
                this.checkOutasGuest = false;

                this.carecart=false;
                this.OpenCCRedirectMessage=false;
                this.secondPage=false;
                this.currentStep = "1";
                this.CartLendChangeChampion=false;
                this.CartChangeChampion=false;
                this.thirdPage=false;
                this.fourthPage=false
                this.fifthPage=false;
                this.firstPage=true;
                this.overflowTrue();
                this.resetCartVisible();
            }
            this.OpenCCRedirectMessage=false;
            this.secondPage=false;
            this.CartLendChangeChampion=false;
            this.CartChangeChampion=false;
        }
        else if(this.currentStep == "3"){
            this.OpenCCRedirectMessage=false;
            //this.createAccount=true;
            this.currentStep = "2";
            this.firstPage=false;
            this.secondPage=true;
            this.checkOutasGuest = false;
            this.guestCheckout = false;
            this.CartLendChangeChampion=false;
            this.CartChangeChampion=false;
            this.thirdPage=false;
            this.isRemainingBalance = false;
        }
        else if(this.currentStep == "4"){
            this.thirdPage=true;
            this.fourthPage=false;
            this.currentStep = "3";
            this.showCreditCard = this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            this.LenderbalanceChecked = false;
        }
        else if(this.currentStep == "5"){
            if(this.noMobilePhone && this.noPostcode){
                this.thirdPage=true;
                this.fourthPage=false
                this.currentStep = "3";
                this.fifthPage = false;
                this.showCreditCard = this.isshowCreditCard;
                this.showPaypal = this.isshowPaypal;
                this.showApplePay = this.isshowApplePay;
                this.showGooglePay = this.isshowGooglePay;
                this.LenderbalanceChecked = false;
            }
            else{
                this.fourthPage=true;
                this.currentStep = "4";
                this.fifthPage = false;

                this.thirdPage=false;
            }
            
        }
        else{
            this.carecart=false;
            this.OpenCCRedirectMessage=false;
            this.secondPage=false;
            //this.createAccount=true;
            this.currentStep = "1";
            this.CartLendChangeChampion=false;
            this.CartChangeChampion=false;
            this.thirdPage=false;
            this.fourthPage=false
            this.fifthPage=false;
            this.firstPage=true;

            //this.amounttocart=this.testTotal;
            //this.resetScroll();
            //this.testTotal=this.totalCartAmount;
            this.overflowTrue();
            this.resetCartVisible();
        }
    }
    overflowTrue(){
        
        const overflow = true;
        //console.log(this.currentValueFromInput);
        const sentFromNavBar=new CustomEvent('fromnavbar',{detail:overflow});
        this.dispatchEvent(sentFromNavBar);
        
    }
    overflowFalse(){
        
        const overflow = false;
        //console.log(this.currentValueFromInput);
        const sentFromNavBar=new CustomEvent('fromnavbar',{detail:overflow});
        this.dispatchEvent(sentFromNavBar);
        
    }

    OpenDashboardPage(){
        window.location.assign('/caredashboard');
    }
    OpenHomePage(){
        window.location.assign('/carebecomechangechampion');
    }
    handleCheckoutGuest(){
        this.guestCheckout = true;
        this.checkOutasGuest = false;
        var isCC = localStorage.getItem('isCC')
        console.log('IISSL:',isCC, this.changeChampionTemplate);
        if( isCC!= undefined && isCC!= 'undefined' ){
            this.checkPreviousChangeChampion();
        }
    }
    handleCheckoutBack(){
        this.guestCheckout = false;
        this.checkOutasGuest = true;
    }

    handleStripePay(event) {
        this.paymentToken = event.detail;
        this.gotoThankYouPayNow();
    }

    paymentError = '';

    gotoThankYouPayNow(){
        this.paymentError = '';
        this.isLoading = true;

        let transactionIds = [];
        for (const item of this.loanidfromparent) {
            if(item.TransactionId != undefined){
                transactionIds.push(item.TransactionId);
            }
        }
        if(this.TopupTransactionId && this.TopupTransactionId !== null && this.TopupTransactionId !== 'null') {
            transactionIds.push(this.TopupTransactionId);
        }
        if(this.pageData['Id'] && this.pageData['Id'] !== null && this.pageData['Id'] !== 'null') {
            transactionIds.push(this.pageData['Id']);
        }

        console.log('transactionIds -> ', transactionIds);

        let request = {
            contactId: this.contactid,
            amount: 0,
            transactionsIds: transactionIds,
            usedLenderBalance: 0
        };

        let amount = this.loanAndRdAmount + this.topUpAmount;
        let usedLenderBalance = 0;
        console.log('this.lenderBalanceSelected -> ' + this.lenderBalanceSelected);

        console.log('this.topUpAmount -> ' + this.topUpAmount);
        console.log('this.lenderBalanceAmount -> ' + this.lenderBalanceAmount);
        console.log('this.loanAndRdAmount -> ' + this.loanAndRdAmount);

        if(this.lenderBalanceSelected) {
            if(this.topUpAmount > 0) {
                if(this.lenderBalanceAmount > this.loanAndRdAmount) {
                    amount = this.topUpAmount;
                    usedLenderBalance = this.loanAndRdAmount;
                } else {
                    amount = this.loanAndRdAmount - this.lenderBalanceAmount + this.topUpAmount;
                    usedLenderBalance = this.lenderBalanceAmount;
                }
            } else {
                if(this.lenderBalanceAmount > this.loanAndRdAmount) {
                    amount = 0;
                    usedLenderBalance = this.loanAndRdAmount;
                } else {
                    amount = this.loanAndRdAmount - this.lenderBalanceAmount;
                    usedLenderBalance = this.lenderBalanceAmount;
                }
            }
        }

        console.log('usedLenderBalance -> ' + usedLenderBalance);

        console.log('Final amount -> ' + amount);

        request = {
            ...request,
            amount: amount,
            usedLenderBalance: usedLenderBalance
        };

        
        if(this.paymentToken && this.paymentToken.object === 'token') {
            request = {
                ...request,
                tokenId: this.paymentToken.id,
                paymentTypeId: this.paymentToken.card.id
            };

            processPaymentByCard(request)
            .then((data) => {
                if(this.rdAmount && this.rdAmount > 0) {
                    this.processRDFromCart();
                } else {
                    this.setThankYouPayNow(data);
                }
            }).catch((error) => {
                this.paymentError = this.reduceErrors(error);
                console.log('error -> ', error);
            }).finally(() => {
                if(!(this.rdAmount && this.rdAmount > 0)) {
                    this.isLoading = false;
                }
            });
        } else if(this.paymentToken && this.paymentToken.object === 'payment_method') {
            request = {
                ...request,
                tokenId: this.paymentToken.id
            };
            processPaymentByWallet(request)
            .then((data) => {
                this.setThankYouPayNow(data);
            }).catch((error) => {
                this.paymentError = this.reduceErrors(error);
                console.log('error -> ', error);
            }).finally(() => {
                this.isLoading = false;
            });
        } else if(this.payByMethod = 'Existing balance amount') {
            request = {
                ...request,
                tokenId: '',
                paymentTypeId: ''
            };

            processPaymentByCard(request)
            .then((data) => {
                this.setThankYouPayNow(data);
            }).catch((error) => {
                this.paymentError = this.reduceErrors(error);
                console.log('error -> ', error);
            }).finally(() => {
                this.isLoading = false;
            });
        } else if(this.rdAmount && this.rdAmount > 0) {
            this.processRDFromCart();
        }
    }

    processRDFromCart() {
        let request = {
            contactId: this.contactid,
            tokenId: this.rdToken.id,
            paymentTypeId: this.rdToken.card.id,
            amount: this.rdAmount
        };

        this.isLoading = true;
        processRD(request)
        .then((data) => {
            this.setThankYouPayNow(data);
        }).catch((error) => {
            this.paymentError = this.reduceErrors(error);
            console.log('error -> ', error);
        }).finally(() => {
            this.isLoading = false;
        });
    }

    reduceErrors(error) {
        let errorMessage;
        if(error.body.message) {
            errorMessage = error.body.message;
        } else if(error.body.pageErrors) {
            errorMessage = error.body.pageErrors[0].message;
        }

        return errorMessage;
    }

    setThankYouPayNow(data) {
        if(data.isError) {
            this.paymentError = data.message;
        } else {
            this.OpenThankyouPageWithNavBar=true;
            this.fifthPage=false;
            this.CartModules=false;
            this.loanidfromparent = [];
            localStorage.setItem('myArray', JSON.stringify(this.loanidfromparent));
            const clearloans = true;
            const deleteAllLoans = new CustomEvent('clearloans', {
            detail: clearloans
            });

            this.dispatchEvent(deleteAllLoans);
            localStorage.setItem('isVoluntary',false);
            localStorage.setItem('vdId',null);
            localStorage.setItem('isCC',null);
            this.rdData['Id'] = '';
            this.rdData['npe03__Amount__c'] = 0;
            localStorage.setItem('isTopup',false);
            localStorage.setItem('TopupTransactionId','');
            localStorage.setItem('topupAmountfromStorage','');


            
        }
    }

    CloseThankYouAfterPayNow(){
        this.OpenThankyouPageWithNavBar=true;
        this.ThankYouAfterPayNow=false;
        this.CartModules=false;
        console.log('from close cart modules CloseThankYouAfterPayNow')
    }
    openMoreVouchers(){
        this.ThankYouAfterPayNow=true;
    }
    closeMoreVouchers(){
        this.ThankYouAfterPayNow=false;
    }

     get comboboxOptions() {
        return [
            { label: '$25', value: '$25' },
            
        ];
    }
    get combobox2Options() {
        return [
            { label: '0%', value: '0' },
            { label: '5%', value: '5' },
            { label: '10%', value: '10' },
            { label: '15%', value: '15' },
            { label: '25%', value: '25' },
            { label: 'Other', value: 'Other' },
            
        ];
    }

    cartItems =[
        {Id:1, Name:'Parichat Contribution', Amount:'$25.00'},
        {Id:2, Name:'Voluntary donation', Amount:'$2.50'},
    ];
    gotoCartChangeChampion(){
        this.firstPage=false;
        this.secondPage=true;
        this.createAccount=false;
        this.currentStep = "1";
        this.CartLendChangeChampion=false;
        this.CartChangeChampion=true;
        console.log('gotoSecondPage')
    }

    setPaymentMethods(){
        if(this.testTotal > 0){
            this.amountZero = false;
        }
        console.log('')
        if(this.loanidfromparent.length>0){
            this.haveLoaninCart = true;
        }
        console.log('');
        if(this.loanidfromparent.length<0  && this.LenderTopup==true
        && this.changeChampionTemplate ==false){
            this.haveLenderBalance = false;
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            
        }
        else if(this.loanidfromparent.length<0  && this.LenderTopup==false
        && this.changeChampionTemplate ==true){
            this.haveLenderBalance = false;
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            
        }
        else if(this.loanidfromparent.length<0  && this.LenderTopup==true
        && this.changeChampionTemplate ==true){
            this.haveLenderBalance = false;
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            
        }
        else if(this.loanidfromparent.length>0  && this.LenderTopup==true
        && this.changeChampionTemplate ==true){
            if(this.isGuestUser == false){
                this.haveLenderBalance = true;
             }
            console.log('1796')
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            
        }
        else if(this.loanidfromparent.length>0  && this.LenderTopup==true
        && this.changeChampionTemplate ==false){
            if(this.isGuestUser == false){
                this.haveLenderBalance = true;
             }
            console.log('1806')
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            
        }
        else if(this.loanidfromparent.length>0  && this.LenderTopup==false
        && this.changeChampionTemplate ==false){
             if(this.isGuestUser == false){
                this.haveLenderBalance = true;
             }
            
            console.log('1816')
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            
        }
        else if(this.loanidfromparent.length>0  && this.LenderTopup==false
        && this.changeChampionTemplate ==true){
             if(this.isGuestUser == false){
                this.haveLenderBalance = true;
             }
            
            console.log('1816')
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            
        }
        else if(this.loanidfromparent.length==0  && this.LenderTopup==true
        && this.changeChampionTemplate ==false){
            this.haveLenderBalance = false;
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            
        }
        else if(this.loanidfromparent.length==0  && this.LenderTopup==false
        && this.changeChampionTemplate ==true){
            this.haveLenderBalance = false;
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
        }
        else if(this.loanidfromparent.length==0  && this.LenderTopup==true
        && this.changeChampionTemplate ==true){
            this.haveLenderBalance = false;
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
        }
        console.log('1845');
        if(this.isGuestUser == true){
            this.haveLenderBalance = false;
            this.showCreditCard =this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            console.log('1862')
        }


    }
    //It will take us to 3rd page
    gotoSecondPage(){
        
        this.setPaymentMethods();
            console.log('RD id ', this.rdData['Id'])
            console.log('RD amount ', (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0));
            console.log('topup amount ', this.topUpAmount);
            console.log('Voluntary donation trans id ', this.pageData['Id'] ? this.pageData['Id']:0);
            console.log('TopupTransactionId ', this.TopupTransactionId);
        
        if(this.LenderTopup == true && this.topUpAmount < 10){
             this.errorMessageTopup = true;
             console.log('1592 line')
        }
        else{
            this.errorMessageTopup = false;
            console.log('1596 line')
        }
        if(this.loanidfromparent!=undefined && this.testTotal >= 100 && this.defaultDonationPercentage >= 15 && 
        this.loanidfromparent.length >= 2 && this.voluntaryDonationClosed == false 
        && this.changeChampionTemplate == false && this.errorMessageTopup == false
        && this.errorMessageTopupkKYCPending == false && this.errorMessageTopupNull == false
        ){
            //this.firstPage=false;
            this.OpenCCRedirectMessage=true;
            //this.secondPage=true;
            //this.createAccount=true;
            //this.currentStep = "2";
            this.CartLendChangeChampion=false;
            this.CartChangeChampion=false;
            this.amountZero = false;
        }
        else if(this.testTotal == 0){
            this.amountZero = true;
        }
        else if(this.errorMessageTopup == false){
            //console.log('Enter');
            this.showGuestError = false; 
            this.secondPage=false;
            this.checkOutasGuest=false;
            this.createAccount=false;
            this.signIn=false;
            
            this.rdToken = {};
            this.paymentToken = {};
            this.createTokenForRd = false;
            this.cardPayment=false;
            this.paypalPayment=false;
            this.googlePayment=false;

            this.thirdPage=false;
    
            this.thirdPage=true;
            this.currentStep = "3";
            /* isGuestUser().then(isGuestUser=>{
                console.log('isGuestUser:',isGuestUser);
                this.OpenCCRedirectMessage=false;
                this.checkOutasGuest=false;
                this.createAccount=false;
                this.signIn=false;
                this.firstPage=false;
                this.amountZero = false;
                this.isGuest = isGuestUser;
                if( isGuestUser == true || isGuestUser == undefined || isGuestUser == null ){
                    console.log('Inside',isGuestUser == true , isGuestUser == undefined , isGuestUser == null );
                    this.thirdPage=false;
                    this.currentStep = "2";
                    this.secondPage=true;
                    this.checkOutasGuest = true;
                } else{
                    console.log('Inside3');
                    this.currentStep = "3";
                    this.secondPage=false;
                    this.thirdPage = true;
                    if(this.testTotal < this.lenderBalanceAmount){
                        this.withLenderBalanceOnlyTemplate =true;
                        this.withLenderBalanceAndOthersTemplate =false;
                    }
                    else if(this.testTotal > this.lenderBalanceAmount && this.lenderBalanceAmount != 0){
                        this.withLenderBalanceOnlyTemplate =false;
                        this.withLenderBalanceAndOthersTemplate =true;
                        this.remainingBalanceAmount = this.testTotal - this.lenderBalanceAmount;
                    }
                }
            }).catch(err=>{
                console.log('Error:', err);
            }) */
            /*if(this.LoanAndRDAmount < this.lenderBalanceAmount){
                        this.withLenderBalanceOnlyTemplate =true;
                        this.withLenderBalanceAndOthersTemplate =false;
                        this.isRemainingBalance = false;
                        this.remainingBalanceAmount = 0;
                    }
                    else if(this.LoanAndRDAmount > this.lenderBalanceAmount && this.lenderBalanceAmount != 0){
                        this.withLenderBalanceOnlyTemplate =false;
                        this.withLenderBalanceAndOthersTemplate =true;
                        this.remainingBalanceAmount = this.LoanAndRDAmount - this.lenderBalanceAmount - 
                        (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
                        - (this.LenderTopup == true? this.topUpAmount:0);
                        //this.isRemainingBalance = true;
                    }*/
        }
    }
    signInAccount(){
        this.secondPage=true;
        this.createAccount=false;
        this.signIn=true;
        this.checkOutasGuest=false;
    }
    createAccountPage(){
        this.secondPage=true;
        this.createAccount=true;
        this.signIn=false;
        this.checkOutasGuest=false;

    }
    gotoCheckOut(){
        this.secondPage=true;
        this.checkOutasGuest=true;
        this.createAccount=false;
        this.signIn=false;
    }
    gotoThirdPage(){
        if( this.termCheck == false || this.guestEmail == undefined || this.guestEmail == '' || this.guestFName == '' || this.guestLName == '' || this.guestFName == undefined || this.guestLName == undefined ){
            this.showGuestError = true;
        } else{
            this.showGuestError = false; 
            this.secondPage=false;
            this.checkOutasGuest=false;
            this.createAccount=false;
            this.signIn=false;
            
            this.rdToken = {};
            this.paymentToken = {};
            this.createTokenForRd = false;
            this.cardPayment=false;
            this.paypalPayment=false;
            this.googlePayment=false;
    
            this.thirdPage=true;
            this.currentStep = "3";
        }
    }
    gotoCartSecondPage(){
        console.log('CCTT:',this.changeChampionTemplate);
        if( this.termCheck == false || this.guestEmail == undefined || this.guestEmail == '' || this.guestFName == '' || this.guestLName == '' || this.guestFName == undefined || this.guestLName == undefined ){
            this.showGuestError = true;
        } else{
            var isCC = localStorage.getItem('isCC')
            if( isCC!= undefined && isCC!= 'undefined' ){
                this.checkPreviousChangeChampion();
            } 
            if( this.changeChampionTemplate == undefined || this.changeChampionTemplate == 'undefined' ){
                this.changeChampionTemplate = false;
console.log('2182');
            }
            this.showGuestError = false; 
            this.secondPage=true;
            this.checkOutasGuest=false;
            this.createAccount=false;
            this.signIn=false;
            
            this.createTokenForRd = false;
            this.cardPayment=false;
            this.paypalPayment=false;
            this.thirdPage=false;
    
            this.thirdPage=false;
            this.currentStep = "2";
            this.firstPage = false;
        }
    }

    createTokenForRd = false;

    ifCardPayment(){
        if(!this.cardPayment) {

            if(this.rdAmount && this.rdAmount > 0) {
                this.createTokenForRd = true;
            }

            this.isLoading = true;

            this.rdToken = {};
            this.paymentToken = {};
            this.cardPayment=true;
            this.paypalPayment=false;
            this.googlePayment=false;

            this.payByMethod = 'Card';
        }
    }

    ifPaypalPayment(){
        this.rdToken = {};
        this.paymentToken = {};
        this.createTokenForRd = false;
        this.cardPayment=false;
        this.paypalPayment=true;
        this.googlePayment=false;

        this.payByMethod = 'Paypal';
    }

    handleStripePaymentComponentLoading(event) {
        this.isLoading = event.detail;
    }

    handleGooglePayClick() {
        this.isLoading = true;

        this.rdToken = {};
        this.paymentToken = {};
        this.createTokenForRd = false;
        this.cardPayment=false;
        this.paypalPayment=false;
        this.googlePayment=true;

        this.payByMethod = 'GooglePay';
        this.setFourthPage();
    }

    paymentDetails = '';
    paymentToken = {};
    rdToken = {};

    gotoFourthPage(event){
        this.paymentToken = event.detail.token;
        this.rdToken = event.detail.rdToken;
        this.setFourthPage();
    }

    setFourthPage() {
        this.paymentError = '';
        this.thirdPage=false;
        if(this.LenderbalanceChecked == true){
            this.payByMethod = 'Existing balance amount';
        }
        if(this.noPostcode && this.noMobilePhone){
            this.fifthPage=true;
            this.currentStep = "5";
            //this.totalLoansAndDonation();
            if(this.paymentToken && this.paymentToken.type === 'card' && this.payByMethod === 'Card') {
                this.paymentDetails = 'Card ending ' + this.paymentToken.card.last4;
            } else {
                this.paymentDetails = '';
            }
        }
        else{
            this.fourthPage=true;
            this.currentStep = "4";
        }
    }

    gotoFifthPage(){
        this.fourthPage=false;
        this.fifthPage=true;
        this.currentStep = "5";
    }

    gotoFirstPage(){
        this.fifthPage=false;
        this.firstPage=true;
    }


    subscribeMC() {
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.context, CARTMC, (message) => {
            this.displayMessage(message);
        });
    }
    displayMessage(message) {
        //console.log('Nav Bar');
        var eventValues = message ? JSON.stringify(message, null, '\t') : undefined;
        if( eventValues != undefined ){
            eventValues = JSON.parse( eventValues );
            console.log( eventValues.messageToSend );
            console.log( eventValues.currentRecordId );
            console.log( eventValues.amountAddedToCart );
            if( eventValues.messageToSend!='NavBar' && eventValues.messageToSend!='Checkout' && 
                eventValues.messageToSend!='ChangeChampion' && eventValues.messageToSend!='BecomeChampionAddToCart' && 
                eventValues.messageToSend!='BecomeChampionCurrChange' && eventValues.messageToSend!='BecomeChampionOtherCurrChange' ){
                this.loanidfromparent = eventValues.currentRecordId;
                this.amounttocart = eventValues.amountAddedToCart;
    
                this.startTimer();
                this.calculateTotalAmount();
            } else if( eventValues.messageToSend=='Checkout' ){
                this.carecart = true;
                var isCC = localStorage.getItem('isCC')
                if( isCC!= undefined && isCC!= 'undefined' ){
                    this.checkPreviousChangeChampion();
                }
                this.checkGuestUser();
            } else if( eventValues.messageToSend=='ChangeChampion' ){
                this.changeChampionTemplate = true;
                console.log('2053 this.changeChampionTemplate = true; ')
                this.becomeChangeChampionActivate( eventValues.currentRecordId );
            } /* else{
                this.changeChampionTemplate = false;
console.log('2332');
            } */
        }
        // this.handleCart();
    }
    //ends care cart
    becomeChangeChampionActivate( amount ){
        /* const selectedButton = event.target;
        // Remove the yellow background from all buttons
        const buttons = this.template.querySelectorAll('.voldonaButtons');
        buttons.forEach(button => {
            button.classList.remove('selected');
        });

        // Add the yellow background to the clicked button
        selectedButton.classList.add('selected'); */
        // this.otherRDAmount=false;
        this.errorOnRDAmount =false;
        this.rdData['npe03__Amount__c'] = amount;
        this.rdData['npe03__Contact__c'] = this.contactid;
        this.rdData['npsp__RecurringType__c'] = 'Fixed';
        this.rdData['PaymentMethod'] = 'Credit Card';
        this.rdData['CurrencyIsoCode'] = 'AUD';
        this.rdData['Payment_Gateway__c'] = 'Stripe';

        //console.log('before currentCartItemsTotalAmount')

        let currentCartItemsTotalAmount =0;
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
            currentCartItemsTotalAmount = this.loanidfromparent
            .filter(record => typeof record.selectedAmount === 'number')
            .reduce((total, item) => total + item.selectedAmount,0);

        }
        //console.log('before currentCartItemsTotalAmount')
        
        this.testTotal = (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0) + 
        currentCartItemsTotalAmount + this.topUpAmount+
        (currentCartItemsTotalAmount * this.donationAmount)/100; /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
        
        console.log('before this.rdData[npe03__Amount__c] ',this.rdData['npe03__Amount__c'])
        console.log('before this.currentCartItemsTotalAmount ',currentCartItemsTotalAmount)
        console.log('before this.topUpAmount ',this.topUpAmount)
        console.log('before this.donationAmount ',this.donationAmount)

        //this.testTotal = parseFloat(this.testTotal.toFixed(2));
        console.log('before creating rd record 35 ', JSON.stringify(this.rdData));
        
        var amt = this.rdData['npe03__Amount__c']!=undefined ? Number(this.rdData['npe03__Amount__c']) : 0;
        localStorage.setItem('rdAmt',amt);
        this.rdAmount = amt;
    }
    signInCC = false;

    showCreditCard = false;
    showPaypal = false;
    showApplePay= false;
    showGooglePay = false;
    vfPageDomain = '';
    isshowCreditCard = false;
    isshowPaypal = false;
    isshowApplePay= false;
    isshowGooglePay = false;
    

    connectedCallback() {

        this.isLoading = true;
        getStripePaymentConfigs().then((data) => {
            this.showCreditCard = data['Allow_Credit_Card__c'];
            this.showPaypal = data['Allow_Paypal__c'];
            this.showApplePay = data['Allow_Apple_Pay__c'];
            this.showGooglePay = data['Allow_Google_Pay__c'];
            this.isshowCreditCard = data['Allow_Credit_Card__c'];
            this.isshowPaypal = data['Allow_Paypal__c'];
            this.isshowApplePay = data['Allow_Apple_Pay__c'];
            this.isshowGooglePay = data['Allow_Google_Pay__c'];
            this.vfPageDomain = data['VF_page_domain__c'];
        }).finally(() => {
            this.isLoading = false;
        });
        
         this.subscribeMC();
         //console.log('Inside cc');
         
         this.checkGuestUser();
         this.supportOneMoreProject = localStorage.getItem('isAdded');
         
         //console.log('this.supportOneMoreProject navbar ', this.supportOneMoreProject);
         this.currentUser();
         this.handleTopup();
         this.handleCart();
        this.handleCC();
        this.testTimer();
        this.handleVD();
    }
    handleVD(){
        let isVD = localStorage.getItem('isVoluntary');
        console.log('isVoluntary ', isVD)
        let isVDid = localStorage.getItem('vdId');
        console.log('isVDid ', isVDid)
        console.log('vdid ', typeof(isVDid))
        if(isVD == 'true'){
            this.voluntaryDonation = true;

        }
        if(isVDid != '' && isVDid != null && isVDid != undefined && isVDid != 'null' 
        && isVDid.length>=15 && isVDid.length<=18){
            this.pageData['Id'] = isVDid;
        }
        this.calculateTotalSelectedAmount();
    }
    testTimer(){
        const closedTimestamp = localStorage.getItem('currentDateTime');
        let elapsedTime = localStorage.getItem('setTime');
        console.log('elapsedTime ', elapsedTime)
        localStorage.setItem('setTime',0);
        localStorage.setItem('currentDateTime',0);

        if(elapsedTime >0 && (elapsedTime != undefined || elapsedTime != '' || elapsedTime != null)
         && this.loanidfromparent!=undefined && this.loanidfromparent.length>0){
            this.setTime = elapsedTime;
            this.startTimer();
        }
        else if(elapsedTime ==0 && (elapsedTime != undefined || elapsedTime != '' || elapsedTime != null)
         && this.loanidfromparent!=undefined && this.loanidfromparent.length>0){
             this.clearArray();

                //console.log('before for loop ')
                for (const item of this.loanidfromparent) {
                    //console.log('inside for loop ')
                    if(item.TransactionId != undefined){
                        //console.log('inside for if condition ')
                        this.idsToDelete.push(item.TransactionId);
                    }
                    
                }
                //console.log('after idsToDelete items ', this.idsToDelete)
                if(this.idsToDelete.length != 0){
                    removeTransactionRecords({recordsToDelete: this.idsToDelete})
                    .then(result  => {
                        //console.log('affter deleting the records bulky ', JSON.stringify(result));
                        this.loanidfromparent=[];
                        this.idsToDelete=[];
                        this.totalCartAmount = 0;
                        //this.FundedAmount = this.FundedAmount - this.amountLeftToFullyFunded;
                        this.progress = (this.FundedAmount / this.GoalAmount) * 100;
                    })
                    .catch(error => {
                        console.log('error deleting bulky items 1807 ', JSON.stringify(error))
                    })
                }
        }


        if(closedTimestamp){
            const currentTime = new Date();
            const reopenedTime = new Date(JSON.parse(closedTimestamp));
            console.log('reopenedTime ',closedTimestamp)
            const timeDifference = currentTime - reopenedTime;
            
            const minutesDifference = timeDifference / (1000 * 60);
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

            console.log('minutesDifference ',minutesDifference)
            console.log('hoursDifference ',hoursDifference)
            console.log('daysDifference ',daysDifference)
        }
        

    }
    


    handleCC(){
        
        this.changeChampionTemplate = localStorage.getItem('isCC');
        console.log('this.changeChampionTemplate 2004 ', this.changeChampionTemplate)
        if(this.changeChampionTemplate == null){
            this.changeChampionTemplate = false;
console.log('2527');
        }
        else if(this.changeChampionTemplate == 'true'){
            console.log('inside else if 2009 ')
            this.showCreditCard = this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
        }
        let rd = localStorage.getItem('RDid');
        let rdAmt = localStorage.getItem('rdAmt');
        console.log('rd conn-- ',rd,rdAmt);
        if(rd != null || rd != undefined){
            this.rdData['Id'] = rd;
            this.rdData['npe03__Amount__c'] = rdAmt;
            this.calculateTotalSelectedAmount();
        }
    }
    handleTopup(){
        let isTopup = localStorage.getItem('isTopup');
        console.log('isTopup from connected ', isTopup);
        this.TopupTransactionId = localStorage.getItem('TopupTransactionId');
        console.log('TopupTransactionId from connected ', this.TopupTransactionId);
        const topupAmountfromStorage = localStorage.getItem('topupAmountfromStorage');
        console.log('topupAmountfromStorage from connected ', topupAmountfromStorage);
        if(isTopup == 'true'){
            this.topupData['Id'] = this.TopupTransactionId; 
            this.LenderTopup = true;
            this.topUpAmount = Number(topupAmountfromStorage);
            //console.log('1523 line navbar ',this.LenderTopup)
            this.calculateTotalSelectedAmount();
            //console.log('1527 line navbar ')
        }
        this.calculateTotalSelectedAmount();

    }
    currentUser(){
        getCurrentUser()
        .then(result => {
            console.log('logged in user ', result.ContactId)
            this.contactid = result.ContactId;
            console.log('1535 navbar page ',this.contactid);
        })
        .catch(error => {
            console.log('error currentUser ', JSON.stringify(error))
        })
    }
    checkGuestUser(){
        isGuestUser().then(isGuestUser=>{
            console.log('isGuestUser:--> ',isGuestUser);
            this.OpenCCRedirectMessage=false;
            this.checkOutasGuest=false;
            this.createAccount=false;
            this.signIn=false;
            this.firstPage=false;
            this.amountZero = false;
            this.isGuest = isGuestUser;
            console.log('this.isGuest--> ',this.isGuest)
            if( isGuestUser == true || isGuestUser == undefined || isGuestUser == null ){
                console.log('Inside',isGuestUser == true , isGuestUser == undefined , isGuestUser == null );
                this.thirdPage=false;
                this.currentStep = "1";
                this.secondPage=false;
                this.firstPage = true;
                this.checkOutasGuest = true;
                this.guestCheckout = false;
                this.haveLenderBalance = false;
                this.showCreditCard =this.isshowCreditCard;
                this.showPaypal = this.isshowPaypal;
                this.showApplePay = this.isshowApplePay;
                this.showGooglePay = this.isshowGooglePay;
                console.log('2412')
            } else{
                console.log('Inside3');
                this.currentStep = "2";
                this.secondPage=true;
                this.thirdPage = false;
                this.firstPage = false; 
                this.checkOutasGuest = false;
                this.guestCheckout = false;
                setTimeout(() => {
                    var isCC = localStorage.getItem('isCC')
                    if( isCC!= undefined && isCC!= 'undefined' ){
                        this.checkPreviousChangeChampion();
                    }
                }, 0);
                /* if(this.testTotal < this.lenderBalanceAmount){
                    this.withLenderBalanceOnlyTemplate =true;
                    this.withLenderBalanceAndOthersTemplate =false;
                }
                else if(this.testTotal > this.lenderBalanceAmount && this.lenderBalanceAmount != 0){
                    this.withLenderBalanceOnlyTemplate =false;
                    this.withLenderBalanceAndOthersTemplate =true;
                    this.remainingBalanceAmount = this.testTotal - this.lenderBalanceAmount;
                } */
            }
        }).catch(err=>{
            console.log('Error:', err);
        })
    }
    idsToUpdate = [];
    updateTransactions(){
        for (const item of this.loanidfromparent) {
            //console.log('inside for loop ')
            if(item.TransactionId != undefined){
                //console.log('inside for if condition ')
                this.idsToUpdate.push(item.TransactionId);
            }
            
        }
        if(this.pageData['Id']!=null &&
        this.pageData['Id']!='null' &&
        this.pageData['Id']!='' &&
        this.pageData['Id']!=undefined &&
        this.pageData['Id']!='undefined' ){
            this.idsToUpdate.push(this.pageData['Id']);
        }
        if(this.TopupTransactionId !=null &&
        this.TopupTransactionId !='null' &&
        this.TopupTransactionId !='' &&
        this.TopupTransactionId !=undefined &&
        this.TopupTransactionId !='undefined' ){
            this.idsToUpdate.push(this.TopupTransactionId);
        }

        
        if(this.contactid != undefined || this.contactid != 'undefined' || this.contactid != null){
            console.log('before updating ', this.idsToUpdate,'contact id ', this.contactid)
            updateTransactionRecords({rec:this.idsToUpdate, conId:this.contactid})
            .then(result => {
                console.log('updated successfully with current lenders ',result);
            })
            .catch(error => {
                console.log('error updating current user ',JSON.stringify(error))
            })
        }
        



    }
    handleCart(){
        var myA = localStorage.getItem('myArray');
        console.log('myA --> ', myA, this.loanidfromparent)
        if( myA!= undefined && myA!='' && myA!= 'undefined' ){
            this.storedArray = JSON.parse(localStorage.getItem('myArray'));            
        }

        if (this.storedArray) {
            // Use the stored array on your page
            this.loanidfromparent = this.storedArray;
            
        } else {
            // Handle the case where the array hasn't been stored yet
            console.log('Array not found in local storage');
        }
        var isCC = localStorage.getItem('isCC')
        console.log('CCCC:',isCC);
        if( isCC!= undefined && isCC!= 'undefined' && isCC == 'true' ){
            this.changeChampionTemplate=true;
            console.log('CCCC2:',isCC);
        } else{
            this.changeChampionTemplate = false;
console.log('2690');
        }
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length>0 || this.changeChampionTemplate==true){
        this.calculateTotalSelectedAmount();
        setTimeout(()=>{
            this.updateTransactions();
        },5000)
        
        }

        var sessionVal = sessionStorage.getItem('UniqueValue');
        if( sessionVal!= '' && sessionVal!=' ' && sessionVal != undefined && sessionVal == '1234' ){
            this.carecart = true;
            this.CartModules = true;
            this.firstPage = true;
            this.signInCC = true;
            sessionStorage.setItem('UniqueValue',undefined);
            var isCC = localStorage.getItem('isCC')
            if( isCC!= undefined && isCC!= 'undefined' ){
                this.checkPreviousChangeChampion();
            }
            /* checkSessionValue( {'sessionId':sessionVal} ).then( res=>{
                if( res=='Success' ){
                    this.carecart = true;
                    this.CartModules = true;
                    this.firstPage = true;
                }
                sessionStorage.setItem('UniqueValue',undefined);
            } ).catch(err=>{

            }); */
        }
        this.debounceTimeout = null;
        const currentPageUrl = window.location.href;
        var currentPageUrl2 = currentPageUrl.substring(0, currentPageUrl.indexOf('/s')+3);
        var createAcc = currentPageUrl2.substring(0,currentPageUrl2.length-2)+'secur/CommunitiesSelfRegUi';
        this.navComponentLinks = {'HomePage':currentPageUrl2+'homepage',
                                    'AboutUs':currentPageUrl2+'aboutus', 
                                    'login':currentPageUrl2+'login', 
                                    'ContactUs':currentPageUrl2+'carecontactus',
                                    'ViewAllLoans':currentPageUrl2+'careviewallloans',
                                    'BecomeChangeChampion':currentPageUrl2+'carebecomechangechampion',
                                    'OurImpact':currentPageUrl2+'ourimpact',
                                    'CareHelpcentre':currentPageUrl2+'carehelpcentre',
                                    'CareDashboard':currentPageUrl2+'caredashboard',
                                    'login':currentPageUrl2+'login',
                                    'createAccount': createAcc
                                };
        //console.log('Current page URL:', currentPageUrl);
        if(currentPageUrl.includes('careviewallloans')){
            this.isVisible=false;
        }
        else if(currentPageUrl.includes('homepage')){
            this.violet=false;
        }
        else if(currentPageUrl.includes('careborrowerspage')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('aboutmicrofinancing')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('aboutus')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('ourimpact')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('carecontactus')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('carenewsandupdates')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('careblogpost')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('carehelpcentre')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('carebecomechangechampion')){
            this.yellow=false;
        }
        else if(currentPageUrl.includes('caresearchresults')){
            this.yellow=false;
        }
    }
    get timeDisplayFormat() {
        const minutes = Math.floor(this.setTime / 60);
        const seconds = this.setTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
@api
   startTimer() {
    console.log('loan id from view all loans page ', this.loanidfromparent.length);


    
     //this.stopTimer();
     if(this.setTime == 0){
         this.setTime = Math.ceil(this.timeDuration / 1000);
     }
    
    this.timerInterval = setInterval(() => {
        if(this.setTime != 0){
            this.setTime--;
        }
        const currentDateTime = new Date();
        const currentDateTimeString = currentDateTime.toISOString(); // You can use other date formats if preferred
        
        // Store the date and time string in local storage
        localStorage.setItem('currentDateTime', JSON.stringify(currentDateTimeString));
        localStorage.setItem('setTime',this.setTime);
        if (this.setTime <= 0) {
            this.stopTimer();
            
        }
    }, 1000);
}

stopTimer() {
   
        clearInterval(this.timerInterval);
        localStorage.setItem('setTime',0);
        this.timerInterval = null;
        //this.loanidfromparent=[];
        //this.amounttocart = 0;
        this.totalCartAmount = 0;
        this.clearArray();
        //console.log('before for loop ')
        for (const item of this.loanidfromparent) {
            //console.log('inside for loop ')
            if(item.TransactionId != undefined){
                //console.log('inside for if condition ')
                this.idsToDelete.push(item.TransactionId);
            }
            
        }
        //vd record id
        if(this.pageData['Id']!=null &&
        this.pageData['Id']!='null' &&
        this.pageData['Id']!='' &&
        this.pageData['Id']!=undefined &&
        this.pageData['Id']!='undefined' ){
            this.idsToDelete.push(this.pageData['Id']);
        }
        console.log('after idsToDelete items ', this.idsToDelete)
        if(this.idsToDelete.length != 0){
            removeTransactionRecords({recordsToDelete: this.idsToDelete})
            .then(result  => {
                //console.log('affter deleting the records bulky ', JSON.stringify(result));
                this.loanidfromparent=[];
                this.idsToDelete=[];
                this.totalCartAmount = 0;
                //this.FundedAmount = this.FundedAmount - this.amountLeftToFullyFunded;
                //this.progress = (this.FundedAmount / this.GoalAmount) * 100;
                this.pageData['Id'] =null;
            })
            .catch(error => {
                console.log('error deleting bulky items ', JSON.stringify(error))
            })
        }

        let currentCartItemsTotalAmount =0;
        if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }

            this.testTotal =  0;
             //this.topUpAmount = 0;
             //this.rdData['npe03__Amount__c'] =0;
             this.donationAmount = '15';
             this.isAdded =false;
    
    
}

    clearArray(){
            const overflow = true;
            //console.log(this.currentValueFromInput);
            const sentFromNavBar=new CustomEvent('fromnavbar',{detail:overflow});
            this.dispatchEvent(sentFromNavBar);
    }
    openLoginPage() {
        this.loginPage = true;
    }

    openMenu() {
        console.log('Js Inside');
        this.isMenuOpen = true;
        this.overflowFalse();
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.overflowTrue();
    }

    SearchMenuOpen(){
        this.isSearchMenuOpen = true;
        this.overflowFalse();
    }

    closeSearchMenu(){
        this.isSearchMenuOpen = false;
        this.overflowTrue();
    }

    toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

      toggleDropdownAbout() {
    this.isDropdownOpenAbout = !this.isDropdownOpenAbout;
  }
  handleSignIn(event){
    var val = event.target.dataset.value;
    console.log(val);
    sessionStorage.setItem('UniqueValue','1234');
    console.log('SS:',sessionStorage.getItem('UniqueValue'));
    this.isGuest = false;
    if( val == 'SignIn' ){
        window.location.href = this.navComponentLinks.login;
    } else if( val == 'Create' ){
        window.location.href = this.navComponentLinks.createAccount;
    } else if( val == 'gmail' ){
        // window.location.href = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=code&client_id=95925662322-jroo0m34qta6c7f2tkfhadkes4l9rr79.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Ftest.salesforce.com%2Fservices%2Fauthglobalcallback&scope=email%20openid%20profile&state=CAAAAYrP1B9YMDAwMDAwMDAwMDAwMDAwAAAA9uW564tEF1Wcwta7K2TM42GBb_ytLK6d9ixGtFYTD8DIvZ1RVizN3m0wZFPFB6fxR8EBRWRjO121gzFss_exP3gOf3uuZyv_se-ofWObCDD95hWpNjkE3oc_vXwiMdDgXiIYw3TacXxyovle9AhIzVIzXIyr15XeYPOtRC5htnm7zckUE4EBRyxSav9_q8UnzBxTiTWYfwbKOXhfNdN-rVYOIr6-ilJbr9gKOlkOY8WMx1HhJkO_0iPDmidJz24dXVWLqmPJ1Dd-6KnE36_V29snQpajucGB0bhphR2VDSzA9mZRVid7Zf0K8iBPrbMo6qn2un4HxflGkyma71ME27HNjElr506e-F9XGhrG7Prdyu5bWuFptFy6WNH84rVRlgsVtoGwxAp6Vtxa7Sv5-79OYEEQnmhrLlm0hbxnQzf6tQEW2mTLT83NNbZVa9QzA_2lccsXRi3EH2Jw4xkKd-6Y4Oxh-Ibt30KL9TUjDc0HWu6M67ZzZP3HaMCTQ1Xx7U_BUQ6SANMfXVHUki2d4zIukUNM8YFJVHZWuVoaud4fOxvCp25n85JlFaG8-_5gbg%3D%3D&service=lso&o2v=1&theme=glif&flowName=GeneralOAuthFlow';
    } else if( val == 'facebook' ){
        window.location.href = '';
    } else if( val == 'Forgot' ){
        window.location.href = this.navComponentLinks.login+'/ForgotPassword'
    }
    /* updateCheckoutValue().then( res=>{
        window.location.href = this.navComponentLinks.login;
    } ).catch( err=>{
        console.log(err);
    } ); */
  }
  handleContinueAsGuest(){
    this.checkOutasGuest = true;
  }
  handleInputChangeGuest( event ){
    var fieldName = event.target.dataset.value;
    var value = event.target.value;
    console.log('fName:',fieldName, value);
    if( fieldName == 'FirstName' ){
        this.guestFName = value;
    } else if( fieldName == 'LastName' ){
        this.guestLName = value;
    } else if( fieldName == 'Email' ){
        this.guestEmail = value;
    } else if( fieldName == 'Terms' ){
        this.termCheck = event.target.checked;
        console.log(this.termCheck);
    }
  }
  openLoginOrDashboard(){
      const currentUrl = window.location.href;
      console.log('openLoginOrDashboard ')
      if(this.contactid != null){
          const newUrldash = currentUrl.replace(/\/s\/[^/]+/, '/s/' + 'caredashboard');
          console.log('newUrldash ',newUrldash)
          window.location.assign(newUrldash);
      }else{
          const newUrllogin = currentUrl.replace(/\/s\/[^/]+/, '/s/' + 'login/');
          console.log('newUrllogin ',newUrllogin)
          window.location.assign(newUrllogin);
      }
  }
  onClickUseLenderBalance(event){
    console.log('checked--> ', event.target.checked);
  }
  isRemainingBalance = false;
  LenderbalanceChecked=false;
  lenderBalanceSelected= false;
  isTopupAdded = false;
  onUseLenderbalance(event){
    console.log('checked--> ', event.target.checked);
    this.lenderBalanceSelected = event.target.checked;

    
    if(event.target.checked == true){
        console.log('2376', this.LenderTopup, this.changeChampionTemplate)
        if(this.LoanAndRDAmount < this.lenderBalanceAmount && this.LenderTopup == false 
        && this.changeChampionTemplate == false){
            this.showCreditCard = false;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            this.LenderbalanceChecked = true;
            console.log('2383 ')
        }
        else if(this.LoanAndRDAmount < this.lenderBalanceAmount && this.LenderTopup == false 
        && this.changeChampionTemplate == true){
            this.showCreditCard = this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            this.LenderbalanceChecked = false;
            console.log('2383 ')
        }
        else if(this.LoanAndRDAmount < this.lenderBalanceAmount && this.LenderTopup == true 
        && this.changeChampionTemplate == true){
            this.showCreditCard = this.isshowCreditCard;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            this.LenderbalanceChecked = false;
            console.log('2383 ')
        }
        else if(this.LoanAndRDAmount > this.lenderBalanceAmount && this.lenderBalanceAmount != 0 && 
        this.LenderTopup == true 
        && this.changeChampionTemplate == false){
            this.showCreditCard = this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            this.LenderbalanceChecked = false;
            this.isRemainingBalance = true;
            console.log('2391 ')
        }
        else if(this.LoanAndRDAmount > this.lenderBalanceAmount && this.lenderBalanceAmount != 0 && 
        this.LenderTopup == false 
        && this.changeChampionTemplate == false){
            this.showCreditCard = this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            this.LenderbalanceChecked = false;
            this.isRemainingBalance = true;
            console.log('2391 ')
        }
        else if(this.LoanAndRDAmount > this.lenderBalanceAmount && this.lenderBalanceAmount != 0 && 
        this.LenderTopup == true 
        && this.changeChampionTemplate == true){
             this.showCreditCard = this.isshowCreditCard;;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            this.LenderbalanceChecked = false;
            
        }
    }
    else if(event.target.checked == false){
        this.isRemainingBalance = false;
        if(this.changeChampionTemplate == true){
            this.showCreditCard = this.isshowCreditCard;;
            this.showPaypal = false;
            this.showApplePay = false;
            this.showGooglePay = false;
            this.LenderbalanceChecked = false;
        }
        else if(this.changeChampionTemplate == false){
            this.showCreditCard = this.isshowCreditCard;
            this.showPaypal = this.isshowPaypal;
            this.showApplePay = this.isshowApplePay;
            this.showGooglePay = this.isshowGooglePay;
            this.LenderbalanceChecked = false;
            console.log('2400 ')
        }
    }
    this.setRemainingBalance();
  }
  setRemainingBalance(){
      console.log('setRemainingBalance() ')
      if(this.lenderBalanceSelected == true){

          if(this.LoanAndRDAmount < this.lenderBalanceAmount){
                        this.withLenderBalanceOnlyTemplate =true;
                        this.withLenderBalanceAndOthersTemplate =false;
                        this.isRemainingBalance = false;
                        this.remainingBalanceAmount = 0;
                    }
            else if(this.LoanAndRDAmount > this.lenderBalanceAmount && this.lenderBalanceAmount != 0){
                this.withLenderBalanceOnlyTemplate =false;
                this.withLenderBalanceAndOthersTemplate =true;
                this.remainingBalanceAmount = this.LoanAndRDAmount - this.lenderBalanceAmount; 
                /*(this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0)
                - (this.LenderTopup == true? this.topUpAmount:0);*/
                this.isRemainingBalance = true;
            }

      }
      else if(this.lenderBalanceSelected == false){
          this.isRemainingBalance = false;
          this.remainingBalanceAmount = 0;
      }       
  }

  
  haveLoaninCart = false;
  LoanAndRDAmount = 0;
  get loanAndRdAmount(){
      let currentCartItemsTotalAmount =0;
            if(this.loanidfromparent!=undefined && this.loanidfromparent.length >0){
                currentCartItemsTotalAmount = this.loanidfromparent
                .filter(record => typeof record.selectedAmount === 'number')
                .reduce((total, item) => total + item.selectedAmount,0);

            }
            let amt = currentCartItemsTotalAmount + (currentCartItemsTotalAmount * Number(this.donationAmount))/100; 
            /* + (this.isAdded ? this.amountLeftToFullyFunded : 0);*/
            console.log('total loan amount ', currentCartItemsTotalAmount);
            console.log('Voluntary donation ', (currentCartItemsTotalAmount * Number(this.donationAmount))/100);
            console.log('RD amount ', (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0));
            console.log('topup amount ', this.topUpAmount);
            console.log('Voluntary donation trans id ', this.pageData['Id']);
            console.log('TopupTransactionId ', this.TopupTransactionId);
            if(amt>0){
                this.haveLoaninCart = true;
            }
            this.LoanAndRDAmount = parseFloat(amt.toFixed(2));
            return parseFloat(amt.toFixed(2));

  }
  RDAmount = 0;
  rdAmount=0;
  get rdAmount(){
      this.RDAmount = this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0;
      return this.RDAmount;
  }
  closechangeChampionTemplate(){
      console.log('2726')
      this.changeChampionTemplate = false;
      localStorage.setItem('isCC',false);
    localStorage.setItem('SelectedCCIndex',false);
    localStorage.setItem('SelectedCCAmount',0);
    localStorage.setItem('OtherChecked', false);

        localStorage.setItem('RDid',null);
        localStorage.setItem('rdAmt',0);
        
        this.rdData['Id'] = null;
        this.rdData['npe03__Amount__c'] = 0;
        console.log('2735')
        this.calculateTotalSelectedAmount();
        console.log('2737')
        
  }
  isprocessingAmount=true;
  get processingAmount(){
      let pAmt = 0;
      this.isprocessingAmount = true;
      if(this.LoanAndRDAmount > this.lenderBalanceAmount && this.lenderBalanceSelected == true
      ){
          //&& this.changeChampionTemplate == false && this.LenderTopup == false
          pAmt = (this.LoanAndRDAmount - this.lenderBalanceAmount) + this.topUpAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0);
          console.log('3135--> loan>balance & true',this.RDAmount)
      }
      else if(this.LoanAndRDAmount > this.lenderBalanceAmount && this.lenderBalanceSelected == false
      ){
          //&& this.changeChampionTemplate == false && this.LenderTopup == false
          pAmt = this.LoanAndRDAmount  + this.topUpAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0);
          console.log('3141--> loan>balance & false',this.RDAmount)
      }
      else if(this.LoanAndRDAmount < this.lenderBalanceAmount && this.lenderBalanceSelected == true
     ){
          pAmt = /*(this.lenderBalanceAmount -this.LoanAndRDAmount) +*/ this.topUpAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0);
          console.log('3146--> loan<balance & true',this.RDAmount)
      }
      else if(this.LoanAndRDAmount < this.lenderBalanceAmount && this.lenderBalanceSelected == false
     ){
          pAmt = this.LoanAndRDAmount + this.topUpAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0);
          console.log('3151--> loan<balance & false',this.RDAmount)
      }
      else if(this.LoanAndRDAmount ==0 
     ){
          pAmt = this.LoanAndRDAmount + this.topUpAmount + (this.rdData['npe03__Amount__c'] ? Number(this.rdData['npe03__Amount__c']) : 0);
          console.log('3156--> only loan ')
      }
      
    
      return pAmt; 
  }
}
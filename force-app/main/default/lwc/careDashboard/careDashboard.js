import { LightningElement, track, api, wire } from 'lwc';
import DashboardPersonAvatars from '@salesforce/resourceUrl/DashboardPersonAvatar';
import greenfield from '@salesforce/resourceUrl/greenfield';
import LendWithCareImages from '@salesforce/resourceUrl/LendWithCareImages';
import ChartImg from '@salesforce/resourceUrl/chartimage';
import CarBanner from '@salesforce/resourceUrl/CarBanner';
import shoppingicon from '@salesforce/resourceUrl/ShoppingCarIcon';
//import getCommunityUser from '@salesforce/apex/LWC_AllLoansCtrl.getCommunityUser';
import getLoansByStage from '@salesforce/apex/LWC_AllLoansCtrl.getLoansByStage';
import getYourTransactionDetails from '@salesforce/apex/LWC_AllLoansCtrl.getYourTransactionDetails';
import getContactInfo from '@salesforce/apex/LWC_AllLoansCtrl.getContactInfo';
import putContactInfo from '@salesforce/apex/LWC_AllLoansCtrl.putContactInfo';
import donateFromDashboard from '@salesforce/apex/LWC_AllLoansCtrl.donateFromDashboard';
import updateCommunicationPreference from '@salesforce/apex/LWC_AllLoansCtrl.updateCommunicationPreference';
import updateCommunicationPreferences from '@salesforce/apex/LWC_AllLoansCtrl.updateCommunicationPreferences';
import getCommunicationPreferences from '@salesforce/apex/LWC_AllLoansCtrl.getCommunicationPreferences';
import getCurrentUser from '@salesforce/apex/LWC_AllLoansCtrl.getCurrentUser';
import PrivacyPolicyCA from '@salesforce/resourceUrl/PrivacyPolicyCA';
import TermsandConditionsCA from '@salesforce/resourceUrl/TermsandConditionsFile';
import updateAutoRelend from '@salesforce/apex/LWC_AllLoansCtrl.updateAutoRelend';
import downloadPDF from '@salesforce/apex/CareHomePageCtrl.getPdfFileAsBase64String';
import LWCSectionMetaData from '@salesforce/apex/CareHomePageCtrl.LWCSectionMetaData';
// import getContactFieldsRecordInfo from '@salesforce/apex/CareHomePageCtrl.getContactFieldsRecordInfo';

// this gets you the logged in user
//import { NavigationMixin } from 'lightning/navigation';
//import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Completed Date', fieldName: 'Completed_Date__c', type: 'date', initialWidth: 150 },
    { label: 'Type', fieldName: 'Type__c', initialWidth: 100 },
    { label: 'Amount', fieldName: 'Amount__c', initialWidth: 100 },
    {
        label: 'Download', type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            iconName: 'utility:download',
            name: 'download',
            title: 'Download',
            disabled: { fieldName: 'disableDownloadButton' },
            variant: 'bare',
            alternativeText: 'Download'
        },
        cellAttributes: {
            class: { fieldName: 'downloadButtonClass' }
        }
    }
];

export default class CareDashboard extends LightningElement {

    @track contactid; //gowsic contact 
    PrivacyPolicyCAFile = PrivacyPolicyCA;
    TermsandConditionsCAFile = TermsandConditionsCA;
    dasAvatarpic = DashboardPersonAvatars;
    avatarpic = greenfield;
    AvatarImg;
    Champion = false;
    chartcolors = ChartImg;
    CarouselBan = CarBanner;
    shopicon = shoppingicon;
    PersonalDetails = false;
    donatePopup = false;
    thankyouPopup = false;
    withdrawPopup = false;
    showalltransactionspopup = false;

    transactionEmail;
    donationEmail;
    @track UserName;
    @track AmountValues = 0;
    @track PlaceholderAmountValues;
    @track TotalLoans;
    @track JobsCreated;
    @track Totalamountlent;
    @track Peoplehelped;

    @track Repaidbyborrower;
    @track Donated;
    @track Addedtoyouraccount;
    @track Withdrawnfromyouraccount;


    progressBarInnerElement;
    stage = 'All';
    @track carouselItems = [];
    @track loansdata = [];
    @track isLoading = false;
    columns = columns;
    transactions = [];
    showAll = false;
    type = 'All';
    @track isSelected = false;
    @track showButton = true;
    @track relendCheckbox = false;
    @track FirstName = '';
    @track LastName = '';
    @track donationAmount = 0;
    @track zeroBalanceofLender = false;

    trData = {};
    @track LenderTopup = false;
    @track carecart = false;

    CommunicationsPreferences = false;
    LendwithcareEmailsChecked;
    AllCAREemailsChecked;
    section1val1;
    section1val2;
    section2val1;
    section2val2;
    section3val1;
    section3val2;
    section4val1;
    section4val2;
   

    @wire(getCommunicationPreferences, { conId: '$contactid' })
    communicationData({ error, data }) {

        if (data) {
            console.log('data from org getCommunicationPreferences ', JSON.stringify(data))
            this.LendwithcareEmailsChecked = data.Email_Lendwithcare_Opt_Out__c;
        }
        else if (error) {
            console.log('getCommunicationPreferences error ', error);
        }
    }
    @wire(LWCSectionMetaData, { category: 'caredashboard' })
    wiredCustomSectionMetaDataRecords({ data, error }) {
        if (data && data.length > 0) {
            console.log('@@@ enter into wire for Your Impact on caredashboard');
            console.log('@@@length:', data.length);
            console.log('@@@ data :', data);
    
            for (let i = 0; i < data.length; i++) {
                if (data[i].MasterLabel == "Your Impact on caredashboard") {
                    this.section1val1 = data[i].Value_1__c;
                    this.section1val2 = data[i].Value_2__c;

                    console.log('@@@ section1val1:', this.section1val1);
                    console.log('@@@ section1val2:', this.section1val2);
                }
                else if (data[i].MasterLabel == "Your loans") {
                    this.section2val1 = data[i].Value_1__c;
                    this.section2val2 = data[i].Value_2__c;

                    console.log('@@@ section2val1:', this.section2val1);
                    console.log('@@@ section2val2:', this.section2val2);
                }
                else if (data[i].MasterLabel == "Your Lender Account Balance") {
                    this.section3val1 = data[i].Value_1__c;
                    this.section3val2 = data[i].Value_2__c;

                    console.log('@@@ section3val1:', this.section3val1);
                    console.log('@@@ section3val2:', this.section3val2);
                }
                else if (data[i].MasterLabel == "Lender Account settings") {
                    this.section4val1 = data[i].Value_1__c;
                    this.section4val2 = data[i].Value_2__c;

                    console.log('@@@ section4val1:', this.section4val1);
                    console.log('@@@ section4val2:', this.section4val2);
                }
                else if (data[i].MasterLabel == "Your Transactions"){
                    this.section5val1 = data[i].Value_1__c;
                    this.section5val2 = data[i].Value_2__c;

                    console.log('@@@ section5val1:', this.section5val1);
                    console.log('@@@ section5val2:', this.section5val2);
                }
            }
            
        } else if (error) {
            // Handle error
        }
    }

    openCommunicationsPreferences() {
        this.CommunicationsPreferences = true;
    }

    CloseCommunicationsPreferences() {
        this.CommunicationsPreferences = false;
    }

    CommunicationsPreferencesData = {};

    LendwithcareEmails(event) {
        this.LendwithcareEmailsChecked = event.target.checked;

        this.CommunicationsPreferencesData['Id'] = this.contactid;
        this.CommunicationsPreferencesData['Email_Lendwithcare_Opt_Out__c'] = event.target.checked;
        console.log('before updating lot of fields ', this.CommunicationsPreferencesData);
        updateCommunicationPreference({ rec: this.CommunicationsPreferencesData })
            .then(result => {
                console.log('successfully update ', result)
            })
            .catch(error => {
                console.log('error updating ', JSON.stringify(error))
            })

    }

    CommunicationsPreferencesDataAll = {};
    AllCAREemails(event) {
        this.AllCAREemailsChecked = event.target.checked;

        this.CommunicationsPreferencesData['Id'] = this.contactid;
        this.CommunicationsPreferencesData['Email_Lendwithcare_Opt_Out__c'] = event.target.checked;
        console.log('before updating lot of fields ', this.CommunicationsPreferencesData);
        updateCommunicationPreferences({ rec: this.CommunicationsPreferencesData })
            .then(result => {
                console.log('successfully update ')
            })
            .catch(error => {
                console.log('error updating ', JSON.stringify(error))
            })

    }

    topupLenderBalance() {

        this.carecart = true;
        this.LenderTopup = true;

        const childComponent = this.template.querySelector('c-care-nav-bar');
        console.log('before if (childComponent) from dashboard')
        if (childComponent) {
            //childComponent.carecart = true;
            childComponent.openCartPage();

            childComponent.LenderTopup = true;
        }
        localStorage.setItem('isTopup', true);
    }

    fromNavBar(event) {
        if (event.detail == true) {
            this.LenderTopup = false;
            this.carecart = false;
        }


    }


    refreshData() {
        refreshApex(this.wiredTransactionData);
    }
    get getButtonClasses() {
        return 'PillsButton ' + (this.isSelected ? 'selected' : '');
    }

    handleButtonClick(event) {
        this.type = event.target.dataset.type;
        this.isLoading = event.target.dataset.type === 'All' ? false : true;
        this.refreshData();
        this.isSelected = !this.isSelected;
        console.log('@@@@@dataset' + event.target.dataset.type);
    }
    handleFirstName(event) {
        this.FirstName = event.target.value;
        console.log('first name ', this.FirstName)
    }

    handleLastName(event) {
        this.LastName = event.target.value;
        console.log('LastName ', this.LastName)
    }
    // //'003AD00000Bs9xdYAB','Anirudh','P Test'
    // @wire(putContactInfo, { contactId : '003AD00000Bs9xdYAB',FirstName : 'Anirudh',LastName :'Test' })
    // wiredContactData({ error, data }) {
    //     if (data) {
    //         console.log('@@@ASDF@@@'+JSON.stringify(data)); 

    //     }else if (error) {
    //         console.error('Error loading data:', error);
    //     }
    // }
    lendAmt;
    @wire(getContactInfo, { contactId: '$contactid' })
    wiredContactData({ error, data }) {
        if (data) {
            console.log('result contact --> ', JSON.stringify(data))
            this.AvatarImg = data.contactRecord.Profile_Picture__c;
            console.log(this.AvatarImg);
            this.UserName = data.contactRecord.Name;
            this.AmountValues = data.contactRecord.Lender_Balance__c;
            var lAmt = this.AmountValues != null && this.AmountValues != undefined ? this.AmountValues + '' : '0';
            lAmt = lAmt.split('.');
            if (lAmt.length > 1) {
                this.lendAmt = { 'Number': lAmt[0], 'Decimal': lAmt[1] };
            } else if (lAmt.length > 0) {
                this.lendAmt = { 'Number': lAmt[0], 'Decimal': '00' };
            } else if (lAmt == undefined || lAmt.length <= 0) {
                this.lendAmt = { 'Number': '0', 'Decimal': '00' };
            }
            this.donationAmount = data.contactRecord.Lender_Balance__c;
            this.PlaceholderAmountValues = '$' + this.AmountValues;
            this.zeroBalanceofLender = data.contactRecord.Lender_Balance__c <= 0 ? true : false;
            this.TotalLoans = data.contactRecord.Total_Loans__c != null ? data.contactRecord.Total_Loans__c : '0';
            var changeChampionTemplate = localStorage.getItem('isCC');
            console.log('this.changeChampionTemplate 304 ', changeChampionTemplate)
            if (changeChampionTemplate != null && changeChampionTemplate != undefined && changeChampionTemplate !='false' && changeChampionTemplate!=false) {
                this.Champion = true;
                console.log('307');
            }
            //this.Champion = data.contactRecord.Champion__c;
            this.relendCheckbox = data.contactRecord.Auto_Relend__c;
            this.JobsCreated = data.sumOfJobsCreated != null ? data.sumOfJobsCreated : '0';
            // this.Totalamountlent = data.totalTransactionsAmount;
            this.Totalamountlent = data.contactRecord.Total_Amount_Lent__c != null ? data.contactRecord.Total_Amount_Lent__c : '0';
            this.Peoplehelped = data.contactRecord.Total_People_Helped__c != null ? data.contactRecord.Total_People_Helped__c : '0';
            var rPaid = data.mapOfTypeAndAmount['Repayment'] != null && data.mapOfTypeAndAmount['Repayment'] != undefined ? data.mapOfTypeAndAmount['Repayment'] + '' : '0';
            rPaid = rPaid.split('.');
            if (rPaid.length > 1) {
                this.Repaidbyborrower = { 'Number': rPaid[0], 'Decimal': rPaid[1] };
            } else if (rPaid.length > 0) {
                this.Repaidbyborrower = { 'Number': rPaid[0], 'Decimal': '00' };
            } else if (rPaid == undefined || rPaid.length <= 0) {
                this.Repaidbyborrower = { 'Number': '0', 'Decimal': '00' };
            }

            var donate = data.mapOfTypeAndAmount['Donation'] != null ? data.mapOfTypeAndAmount['Donation'] + '' : '0';
            donate = donate.split('.');
            console.log('DD:', donate);
            if (donate.length > 1) {
                this.Donated = { 'Number': donate[0], 'Decimal': donate[1] };
            } else if (donate.length > 0) {
                this.Donated = { 'Number': donate[0], 'Decimal': '00' };
            } else if (donate == undefined || donate.length <= 0) {
                this.Donated = { 'Number': '0', 'Decimal': '00' };
            }
            console.log('DOONNN:', this.Donated);

            var aToAcc = data.mapOfTypeAndAmount['Topup'] != null ? data.mapOfTypeAndAmount['Topup'] + '' : '0';
            aToAcc = aToAcc.split('.');
            if (aToAcc.length > 1) {
                this.Addedtoyouraccount = { 'Number': aToAcc[0], 'Decimal': aToAcc[1] };
            } else if (aToAcc.length > 0) {
                this.Addedtoyouraccount = { 'Number': aToAcc[0], 'Decimal': '00' };
            } else if (aToAcc == undefined || aToAcc.length <= 0) {
                this.Addedtoyouraccount = { 'Number': '0', 'Decimal': '00' };
            }
            // this.Donated = data.mapOfTypeAndAmount['Donation'] != null ? data.mapOfTypeAndAmount['Donation'] : '0';
            //this.Addedtoyouraccount = data.mapOfTypeAndAmount['Topup'] != null ? data.mapOfTypeAndAmount['Topup'] : '0';
            var withdrawAcc = data.mapOfTypeAndAmount['Withdrawal'] != null ? data.mapOfTypeAndAmount['Withdrawal'] + '' : '0';
            withdrawAcc = withdrawAcc.split('.');
            if (withdrawAcc.length > 1) {
                this.Withdrawnfromyouraccount = { 'Number': withdrawAcc[0], 'Decimal': withdrawAcc[1] };
            } else if (withdrawAcc.length > 0) {
                this.Withdrawnfromyouraccount = { 'Number': withdrawAcc[0], 'Decimal': '00' };
            } else if (withdrawAcc == undefined || withdrawAcc.length <= 0) {
                this.Withdrawnfromyouraccount = { 'Number': '0', 'Decimal': '00' };
            }
            // this.Withdrawnfromyouraccount = data.mapOfTypeAndAmount['Withdrawal'] != null ? data.mapOfTypeAndAmount['Withdrawal'] : '0';

            this.carouselItemsImpact = [{title:this.TotalLoans,description:'Number of loans'},{title:this.Totalamountlent,description:'Total amount lent'},
                                        {title:this.JobsCreated,description:'Jobs created'},{title:this.Peoplehelped,description:'People helped'}
                                        ];
            this.carouselItemsImpactBreak = [{title:data.mapOfTypeAndAmount['Repayment'] != null && data.mapOfTypeAndAmount['Repayment'] != undefined ? data.mapOfTypeAndAmount['Repayment'] + '' : '0',description:'Repaid by borrower'},
                                        {title:data.mapOfTypeAndAmount['Donation'] != null ? data.mapOfTypeAndAmount['Donation'] + '' : '0',description:'Donated'},
                                        {title:data.mapOfTypeAndAmount['Topup'] != null ? data.mapOfTypeAndAmount['Topup'] + '' : '0',description:'Added to your account'},
                                        {title:data.mapOfTypeAndAmount['Withdrawal'] != null ? data.mapOfTypeAndAmount['Withdrawal'] + '' : '0',description:'Withdrawn from your account'}
                                        ];
        } else if (error) {
            console.error('Error loading data: contact info ', JSON.stringify(error));
        }
    }
    showTransaction = false;
    viewMoreTransacions = false;
    @wire(getYourTransactionDetails, { type: '$type', contactId: '$contactid', showAll: '$showAll' })
    wiredTransactionData({ error, data }) {
        this.isLoading = false;

        // let formattedDate = new Date(data[0].Completed_Date__c).toLocaleDateString("en-GB");
        // console.log(formattedDate);

        if (data) {
            this.transactions = data.map((transaction) => ({
                ...transaction,
                disableDownloadButton: transaction.Type__c !== 'Donation',
                downloadButtonClass: transaction.Type__c === 'Donation' ? 'slds-show' : 'slds-hide',
            }));
            this.showTransaction = false;
            if (this.transactions.length > 0) {
                this.viewMoreTransacions = this.transactions.length>7;
                this.transactions = this.transactions.slice(0,7);
                this.showTransaction = true;
            }
        } else if (error) {
            console.error('Error loading data:', error);
        }
    }

    getRowClass(index) {
        return index % 2 === 0 ? 'even-row' : 'odd-row';
    }

    @wire(getLoansByStage, { stage: '$stage', contactId: '$contactid' })
    wiredLoans({ error, data }) {
        this.isLoading = false; // Hide spinner once data is retrieved or if there's an error
        if (data) {
            this.loansdata = null;
            this.loansdata = data;
            this.error = undefined;
            console.log('@@@@loansdata', JSON.stringify(this.loansdata));
            this.getcorousal();
        } else if (error) {
            this.error = error;
            this.loansdata = [];
        }
    }

    formatCompletedDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    currentUser() {
        this.isLoading = true;
        getCurrentUser()
            .then(result => {
                console.log('current user -dashboard ', JSON.stringify(result))
                this.contactid = result.Contact.Id;
                console.log('this.contactid--> getCurrentUser() ', this.contactid);

                if (this.contactid == null || this.contactid == undefined || this.contactid == '') {
                    const currentUrl = window.location.href;
                    const newUrllogin = currentUrl.replace(/\/s\/[^/]+/, '/s/' + 'login/');
                    window.location.assign(newUrllogin);
                }
                this.isLoading = false;
                /* if( this.contactid!=undefined ){
                    this.getContactFields();
                } */
            })
            .catch(error => {
                // this.isLoading = false;
                const currentUrl = window.location.href;
                const newUrllogin = currentUrl.replace(/\/s\/[^/]+/, '/s/' + 'login/');
                window.location.assign(newUrllogin);
                console.log('This error:', error);
                console.log('error ', JSON.stringify(error))
            })
    }
    htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, 'text/html');
        let parsedstring = doc.documentElement.textContent;

        return parsedstring;
    }
    contactValues;
    /* getContactFields(){
        console.log('ContactField:',this.contactid);
        getContactFieldsRecordInfo({'contId':this.contactid}).then( fieldsMap=>{
            console.log( 'FMap:',fieldsMap );
            if( fieldsMap!=undefined ){
                var contFields = JSON.parse( JSON.stringify(fieldsMap) );
                contFields = contFields[0];
                console.log( 'FFFMM:', contFields );
                var contVals = {};
                for( var val in contFields ){
                    console.log('FFFMM:',val);
                    contVals[val] = contFields[val];
                }
                this.contactValues = contVals;
            }
            
        } ).catch( err=>{
            console.log('Error:',err)
        } );
    } */
    handleAutoReLend(event) {
        console.log(event.target.checked);
        updateAutoRelend({ contactId: this.contactid, enable: event.target.checked }).then(res => {
            this.relendCheckbox = event.target.checked;
        }).catch(err => {
            console.log(err);
        });
    }
    connectedCallback() {
        this.currentUser();
        //this.getCMSContent();
        // getCommunityUser()
        //     .then(result => {
        //         console.log('Result: ', result);
        //     })
        //     .catch(error => {
        //         console.error('Error: ', error);
        //     });

        // let checkbox = this.template.querySelector('[data-id="relendCheckbox"]');
        // checkbox.checked = true;
    }

    // async fetchAndSetImage(url) {
    //     const dataUrl = await fetchAndConvertImage(url);
    //     if (dataUrl) {
    //         this.AvatarImg = dataUrl;
    //     }
    // }

    confirmChanges() {
        console.log('ENTER IN CONFIRM CHANGES' + this.contactid + ' ' + JSON.stringify(this.FirstName) + ' ' + JSON.stringify(this.LastName));
        putContactInfo({ contactId: this.contactid, FirstName: this.FirstName, LastName: this.LastName }) //LWC_AllLoansCtrl.putContactInfo('003AD00000Bs9xdYAB','Anirudh','Test');
            .then(updatedContact => {
                console.log('ENTER IN CALLING APEX');
                // Success handling, if needed
                console.log('Contact updated:', updatedContact);
                // Refresh the page to reflect the updated contact details
                this.PersonalDetails = false;
                // Call refreshApex if you need to refresh other data fetched using @wire
                location.reload();
            })
            .catch(error => {
                // Error handling, if needed
                console.error('Error updating Lender Details:', error);
            });
    }

    updatePersonalDetails() {
        this.PersonalDetails = true;
    }
    ClosePersonalDetails() {
        this.PersonalDetails = false;
    }
    openWithdrawPopup() {
        this.withdrawPopup = true;
    }
    openDonatePopup() {
        this.donatePopup = true;
    }
    CloseDonatePopup() {
        this.donatePopup = false;
    }
    gotoThankYou() {
        this.thankyouPopup = true;
        this.donatePopup = false;
    }
    CloseThankyouPopup() {
        this.thankyouPopup = false;
        window.location.reload();
    }

    closePopup() {
        this.withdrawPopup = false;
    }
    handleViewTransactionsClick() {
        const baseUrl = 'https://careaustralia--centqa.sandbox.my.site.com/LendwithCare/s/';
        //const urlWithParameters = baseUrl + 'caredasboardtransactions?Id=' + btoa(this.contactid); //Encrypt the id
        const urlWithParameters = baseUrl + 'caredasboardtransactions?Id=' + this.contactid;

        window.location.href = urlWithParameters;
    }
    handleRedirectWithdraw() {
        const baseUrl = 'https://careaustralia--centqa.sandbox.my.site.com/LendwithCare/s/dashboardwithdraw';
        const urlWithParameters = baseUrl + '?Id=' + this.contactid;
        window.location.href = urlWithParameters;
    }
    navigateTocarebecomechangechampionURL() {
        window.location.href = 'https://careaustralia--centqa.sandbox.my.site.com/LendwithCare/s/carebecomechangechampion';
    }

    navigateToBorrowerupdates() {
        window.location.href = 'https://careaustralia--centqa.sandbox.my.site.com/LendwithCare/s/careborrowerspage';
    }

    handleDownloadStatementClick() {
        // Logic to handle the "Download statement" button click
        // This is where you can implement what happens when the button is clicked
    }


    getcorousal() {
        for (var i = 0; i < this.loansdata.length; i++) {
            let carouselItem = {
                id: this.loansdata[i].Loan__c,
                imageUrl: LendWithCareImages + '/client1.png',
                title: this.loansdata[i].Loan__r?.Loan_Title__c,
                location: this.loansdata[i].Loan__r?.Location_of_Business__c,
                description: this.loansdata[i].Loan__r?.Loan_Description__c.length > 30 ? this.loansdata[i].Loan__r?.Loan_Description__c.substring(0, 30) + "..." : this.loansdata[i].Loan__r?.Loan_Description__c,
                Lent: '',
                Goal: this.loansdata[i].Loan__r?.Funded__c == 100 ? 'Goal Reached!' : 0,
                Button: 'Garment Factory',
                widthValue: 'width:' + (this.loansdata[i].Loan__r?.Funded__c != null ? this.loansdata[i].Loan__r?.Funded__c : '0') + '%;'

            };
            this.carouselItems.push(carouselItem);
        }
    }

    handleChange(event) {
        this.carouselItems = [];
        this.stage = event.target.value;
        this.isLoading = true;
        this.template.querySelector("c-carouselcmp_-homepage").getLoansForCarousel(this.stage);
    }

    get backAvatarImage() {
        return `background-image: url('${this.AvatarImg}');background-size: cover; background-repeat: no-repeat;`;
    }

    @track carouselItemsImpact /* = [
        {

            title: '17',
            description: 'Number of loans.'

        },
        {
            title: '$340',
            description: 'Total amount lent.'
        },
        {
            title: '17',
            description: 'Number of loans.'
        },
        {
            title: '$340',
            description: 'Total amount lent.'
        },
        {
            title: '17',
            description: 'Number of loans.'
        },
        {
            title: '$340',
            description: 'Total amount lent.'
        },
        {
            title: '17',
            description: 'Number of loans.'
        },
        {
            title: '$340',
            description: 'Total amount lent.'
        }
    ]; */

    @track currentSlideIndexImpact = 0;
    @track visibleSlidesImapct = 4;

    get sliderStylesImpact() {
        const translateXValue = this.currentSlideIndexImpact * (100 / this.visibleSlidesImapct);
        return `transform: translateX(-${translateXValue}%);`;
    }

    get visibleCarouselItems() {
        return this.carouselItemsImpact.slice(this.currentSlideIndexImpact, this.currentSlideIndexImpact + this.visibleSlidesImapct);
    }

    previousSlideImpact() {
        if (this.currentSlideIndexImpact > 0) {
            this.currentSlideIndexImpact--;
        }
    }

    nextSlideImpact() {
        if (this.currentSlideIndexImpact < this.carouselItemsImpact.length - this.visibleSlidesImapct) {
            this.currentSlideIndexImpact++;
        }
    }

    handleDotClickImpact(event) {
        const index = event.target.dataset.index;
        this.currentSlideIndexImpact = parseInt(index);
    }


    @track currentSlideIndex = 0;
    @track visibleSlides = 4;

    get getcarbackImage() {
        return `background-image: url('${this.CarouselBan}');background-size: cover; background-repeat: no-repeat;`;
    }

    get sliderStyles() {
        const translateXValue = this.currentSlideIndex * (100 / this.visibleSlides);
        return `transform: translateX(-${translateXValue}%);`;
    }

    get visibleCarouselItems() {
        return this.carouselItems.slice(this.currentSlideIndex, this.currentSlideIndex + this.visibleSlides);
    }

    previousSlide() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
        }
    }

    nextSlide() {
        if (this.currentSlideIndex < this.carouselItems.length - this.visibleSlides) {
            this.currentSlideIndex++;
        }
    }

    handleDotClick(event) {
        const index = event.target.dataset.index;
        this.currentSlideIndex = parseInt(index);
    }


    @track carouselItemsImpactBreak /* = [
        {

            title: '17',
            description: 'Number of loans.'

        },
        {
            title: '$340',
            description: 'Total amount lent.'
        },
        {
            title: '17',
            description: 'Number of loans.'
        },
        {
            title: '$340',
            description: 'Total amount lent.'
        },
        {
            title: '17',
            description: 'Number of loans.'
        },
        {
            title: '$340',
            description: 'Total amount lent.'
        },
        {
            title: '17',
            description: 'Number of loans.'
        },
        {
            title: '$340',
            description: 'Total amount lent.'
        }
    ]; */

    @track currentSlideIndexImpactBreak = 0;
    @track visibleSlidesImpactBreak = 4;

    get getcarbackImageImpactBreak() {
        return `background-image: url('${this.CarouselBan}');background-size: cover; background-repeat: no-repeat;`;
    }

    get sliderStylesImpactBreak() {
        const translateXValue = this.currentSlideIndexImpactBreak * (100 / this.visibleSlidesImpactBreak);
        return `transform: translateX(-${translateXValue}%);`;
    }

    get visibleCarouselItemsImpactBreak() {
        return this.carouselItems.slice(this.currentSlideIndexImpactBreak, this.currentSlideIndexImpactBreak + this.visibleSlidesImpactBreak);
    }

    previousSlideImpactBreak() {
        if (this.currentSlideIndexImpactBreak > 0) {
            this.currentSlideIndexImpactBreak--;
        }
    }

    nextSlideImpactBreak() {
        if (this.currentSlideIndexImpactBreak < this.carouselItems.length - this.visibleSlidesImpactBreak) {
            this.currentSlideIndexImpactBreak++;
        }
    }

    handleDotClickImpactBreak(event) {
        const index = event.target.dataset.index;
        this.currentSlideIndexImpactBreak = parseInt(index);
    }
    preventPaste(event) {
        event.preventDefault(); // Prevent pasting non-numeric content into the input field
    }
    canDonate = false;
    handleDonationchange(event) {
        this.canDonate = true;
        console.log('this.donationAmount - ', event.target.value)
        if (event.target.value > 0) {
            console.log('its number only ')
            this.donationAmount = parseFloat(event.target.value);
            this.canDonate = false;
        }
    }

    handleDonate(event) {
        // Ensure donationAmount is defined and parsed properly from the input
        const donationAmount = parseFloat(this.donationAmount);
        console.log('parseFloat(this.AmountValues) ', parseFloat(donationAmount));
        console.log('parseFloat(this.AmountValues) ', parseFloat(this.AmountValues));

        if (donationAmount == null && donationAmount <= 0) {
            alert('Donation amount must be greater than 0');
            document.getElementById('donationInput').addEventListener('focus', function () {
                this.value = ''; // Clear the input field when it gains focus
            });

            // console.log('Invalid donation amount');
        } else if (donationAmount > parseFloat(this.AmountValues)) {
            alert('Donation amount must be less than or equal to ' + this.AmountValues);

        } else {
            // Perform donation processing logic here
            //console.log('Donation successful of amount ' + donationAmount);
            this.trData['Lender__c'] = this.contactid;
            this.trData['Amount__c'] = donationAmount;
            this.trData['Type__c'] = 'Donation';


            donateFromDashboard({ rec: this.trData })
                .then(result => {
                    console.log('result successfull from donation record ', JSON.stringify(result))
                    this.gotoThankYou();

                })
                .catch(error => {
                    console.log('error from donation record ', JSON.stringify(error))
                })

            // Create transaction Record and update the value of lendersamount with the values.
        }
    }

    handlezerobalanceDonatebutton() {
        this.donatePopup = false;
    }

    gotoViewAllLoansPage() {
        window.location.assign('careviewallloans')
    }
    //PDF
    /* jsPdfInitialized=false;
    renderedCallback() {
        loadScript(this, PDFDownload).then(() => {}).catch(e=>{});
        if (this.jsPdfInitialized) {
            return;
        }
        this.jsPdfInitialized = true;
    } */
    handleDownload(event) {
        try {
            this.isLoading = true;
            var tIds = '';
            for (var transaction of this.transactions) {
                tIds += transaction.Id + ',';
            }
            var temp = event.target.dataset.template;
            var temp2 = event.currentTarget.dataset.template;
            var tId = event.currentTarget.dataset.transactionId;
            console.log('Temp:', temp, temp2, tId, this.contactid);
            if (tIds.length > 0) tIds = tIds.substring(0, tIds.length - 1);
            if (temp == undefined && temp2 != undefined) {
                temp = temp2;
                tIds = tId;
            }

            downloadPDF({ 'transactionIds': tIds, 'ContactId': this.contactid, 'template': temp }).then(response => {
                const binaryString = atob(response); // Decode the Base64 string to binary
                const byteArray = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    byteArray[i] = binaryString.charCodeAt(i);
                }
                console.log('bStr:', binaryString);
                // Create a Blob from the Uint8Array
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                this.isLoading = false;
                // Create a temporary anchor element to trigger the download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = temp + '.pdf';
                document.body.appendChild(a);
                a.click();

                // Cleanup
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

            }).catch(error => {
                this.isLoading = false;
                console.log('Error: ' + error.toString());
                console.log('Error: ' + JSON.parse(JSON.stringify(error)));
                console.log('Error: ' + JSON.stringify(error));
            });
        } catch (err) {
            console.log(err);
        }
    }
}
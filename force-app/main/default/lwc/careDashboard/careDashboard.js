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

import getContent from '@salesforce/apex/CareHomePageCtrl.getContent';
import downloadPDF from '@salesforce/apex/CareHomePageCtrl.getPdfFileAsBase64String';
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

    @track contactid; //gowsic contact id
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
    @track AmountValues;
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
    
    trData={};
    @track LenderTopup = false;
    @track carecart=false;

    CommunicationsPreferences=false;
    LendwithcareEmailsChecked;
    AllCAREemailsChecked;

    @wire(getCommunicationPreferences, {conId: '$contactid'})
    communicationData({ error, data }) {

        if(data){
            console.log('data from org getCommunicationPreferences ', JSON.stringify(data))
            this.LendwithcareEmailsChecked = data.Email_Lendwithcare_Opt_Out__c;
        }
        else if(error){
            console.log('getCommunicationPreferences error ', error);
        }
    }

    openCommunicationsPreferences(){
        this.CommunicationsPreferences=true;
    }

    CloseCommunicationsPreferences(){
        this.CommunicationsPreferences=false;
    }

    CommunicationsPreferencesData = {};

    LendwithcareEmails(event){
        this.LendwithcareEmailsChecked = event.target.checked;

        this.CommunicationsPreferencesData['Id'] = this.contactid;
        this.CommunicationsPreferencesData['Email_Lendwithcare_Opt_Out__c'] = event.target.checked;
        console.log('before updating lot of fields ', this.CommunicationsPreferencesData);
        updateCommunicationPreference({rec: this.CommunicationsPreferencesData})
        .then(result => {
            console.log('successfully update ', result)
        })
        .catch(error => {
            console.log('error updating ', JSON.stringify(error))
        })

    }

    CommunicationsPreferencesDataAll = {};
    AllCAREemails(event){
        this.AllCAREemailsChecked = event.target.checked;

        this.CommunicationsPreferencesData['Id'] = this.contactid;
        this.CommunicationsPreferencesData['Email_Lendwithcare_Opt_Out__c'] = event.target.checked;
        console.log('before updating lot of fields ', this.CommunicationsPreferencesData);
        updateCommunicationPreferences({rec: this.CommunicationsPreferencesData})
        .then(result => {
            console.log('successfully update ')
        })
        .catch(error => {
            console.log('error updating ', JSON.stringify(error))
        })
        
    }

    topupLenderBalance(){
        
        this.carecart = true;
        this.LenderTopup = true;

        const childComponent = this.template.querySelector('c-care-nav-bar');
            console.log('before if (childComponent) from dashboard')
            if (childComponent) {
                childComponent.carecart = true;
                
                childComponent.LenderTopup = true;
            }
        localStorage.setItem('isTopup', true);
    }

    fromNavBar(event){
    if(event.detail == true){
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
    @wire(getContactInfo, { contactId: '$contactid' })
    wiredContactData({ error, data }) {
        if (data) {
            console.log('result contact --> ', JSON.stringify(data))
            this.AvatarImg = data.contactRecord.Profile_Picture__c;
            console.log(this.AvatarImg);
            this.UserName = data.contactRecord.Name;
            this.AmountValues = data.contactRecord.Lender_Balance__c;
            this.PlaceholderAmountValues = '$'+this.AmountValues;
            this.zeroBalanceofLender = data.contactRecord.Lender_Balance__c == 0 ? true : false;
            this.TotalLoans = data.contactRecord.Total_Loans__c != null ? data.contactRecord.Total_Loans__c  : '00';
            this.Champion = data.contactRecord.Champion__c;
            this.relendCheckbox = data.contactRecord.Auto_Relend__c;
            this.JobsCreated = data.sumOfJobsCreated != null ? data.sumOfJobsCreated : '00';
            this.Totalamountlent = data.totalTransactionsAmount;
            this.Peoplehelped = data.contactRecord.Total_People_Helped__c != null ? data.contactRecord.Total_People_Helped__c : '00';
            this.Repaidbyborrower = data.mapOfTypeAndAmount['Repayment'] != null ? data.mapOfTypeAndAmount['Repayment'] : '00';
            this.Donated = data.mapOfTypeAndAmount['Donation'] != null ? data.mapOfTypeAndAmount['Donation'] : '00';
            this.Addedtoyouraccount = data.mapOfTypeAndAmount['Topup'] != null ? data.mapOfTypeAndAmount['Topup'] : '00';
            this.Withdrawnfromyouraccount = data.mapOfTypeAndAmount['Withdrawal'] != null ? data.mapOfTypeAndAmount['Withdrawal'] : '00';

        } else if (error) {
            console.error('Error loading data: contact info ', JSON.stringify(error));
        }
    }
    showTransaction = false;
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
            if( this.transactions.length > 0 ){
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
    currentUser(){
        getCurrentUser()
        .then(result => {
            console.log('current user -dashboard ', JSON.stringify(result))
            this.contactid = result.Contact.Id;
            console.log('this.contactid--> getCurrentUser() ', this.contactid);
            /* if( this.contactid!=undefined ){
                this.getContactFields();
            } */
        })
        .catch(error => {
            console.log('error ', JSON.stringify(error))
        })
    }
    htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, 'text/html');
        let parsedstring = doc.documentElement.textContent;

        return parsedstring;
    }
    getCMSContent() {
        this.spin = true;
        getContent({ channelName: 'Why LWC' }).then(res => {
            var r = JSON.parse(res);
            console.log(r);
            if (r != undefined) {
                for (var val of r.items) {
                    if (val.type == 'CareAustraliaSite' && val.contentNodes.Tag != undefined) {
                        if( val.contentNodes.Tag.value == 'TransactionEmail' ){
                            console.log('TE:',this.htmlDecode(val.contentNodes.Body.value));
                            this.transactionEmail = this.htmlDecode(val.contentNodes.Body.value);
                        } else if( val.contentNodes.Tag.value == 'DonationEmail' ){
                            console.log('TE:',this.htmlDecode(val.contentNodes.Body.value));
                            this.donationEmail = this.htmlDecode(val.contentNodes.Body.value);
                        } 
                    }
                }
            }
        }).catch(e => {
            console.log('OUTPUT : ', e.toString());
            console.log('OUTPUT : ', e);
        })

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

    confirmChanges(){
        console.log('ENTER IN CONFIRM CHANGES'+this.contactid+' '+JSON.stringify(this.FirstName)+' '+JSON.stringify(this.LastName) );
        putContactInfo({ contactId: this.contactid, FirstName:this.FirstName, LastName:this.LastName}) //LWC_AllLoansCtrl.putContactInfo('003AD00000Bs9xdYAB','Anirudh','Test');
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
   /* openWithdrawPopup() {
        this.withdrawPopup = true;
    }*/
    openDonatePopup() {
        this.donatePopup = true;
    }
    CloseDonatePopup(){
        this.donatePopup = false;
    }
    gotoThankYou(){
        this.thankyouPopup = true;
        this.donatePopup = false;
    }
    CloseThankyouPopup(){
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

    @track carouselItemsImpact = [
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
    ];

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


    @track carouselItemsImpactBreak = [
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
    ];

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

    handleDonationchange(event){
        this.donationAmount = parseFloat(event.target.value);
        console.log('this.donationAmount - ',this.donationAmount)
    }
    
    handleDonate(event) {
        // Ensure donationAmount is defined and parsed properly from the input
        const donationAmount = parseFloat(this.donationAmount);
        console.log('parseFloat(this.AmountValues) ', parseFloat(this.AmountValues));
    /*
        if (donationAmount == null && donationAmount <= 0) {
            alert('Donation amount must be greater than 0');
            document.getElementById('donationInput').addEventListener('focus', function() {
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
            this.trData['Type__c']= 'Donation';
            

            donateFromDashboard({rec:this.trData})
            .then(result => {
                console.log('result successfull from donation record ', JSON.stringify(result))
                this.gotoThankYou();

            })
            .catch(error => {
                console.log('error from donation record ', JSON.stringify(error))
            })
            
            // Create transaction Record and update the value of lendersamount with the values.
        }*/
    }
    
    handlezerobalanceDonatebutton() {
        this.donatePopup = false;
    }

    gotoViewAllLoansPage(){
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
    handleDownload(event){
        try{
            var tIds = '';
            for( var transaction of this.transactions ){
                tIds += transaction.Id +',';
            }
            var temp = event.target.dataset.template;
            var temp2 = event.currentTarget.dataset.template;
            var tId = event.currentTarget.dataset.transactionId;
            console.log('Temp:',temp, temp2, tId);
            if( tIds.length>0 ) tIds = tIds.substring(0,tIds.length-1);
            if( temp==undefined && temp2!=undefined ){
                temp = temp2;
                tIds = tId;
            }

            downloadPDF({'transactionIds':tIds, 'ContactId':this.contactid, 'template':temp}).then(response => {
                const binaryString = atob(response); // Decode the Base64 string to binary
                    const byteArray = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        byteArray[i] = binaryString.charCodeAt(i);
                    }
                    console.log('bStr:',binaryString);
                    // Create a Blob from the Uint8Array
                    const blob = new Blob([byteArray], { type: 'application/pdf' });

                    // Create a temporary anchor element to trigger the download
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = temp+'.pdf';
                    document.body.appendChild(a);
                    a.click();

                    // Cleanup
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

            }).catch(error => {
                console.log('Error: ' +error.toString());
                console.log('Error: ' +JSON.parse(JSON.stringify(error)));
                console.log('Error: ' +JSON.stringify(error));
            });
        }catch(err){
            console.log(err);
        }
    }   
}
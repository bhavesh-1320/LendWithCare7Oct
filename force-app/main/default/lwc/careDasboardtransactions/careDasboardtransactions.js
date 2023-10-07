import { LightningElement, track, api, wire } from 'lwc';
import LendWithCareImages from '@salesforce/resourceUrl/LendWithCareImages';
import Mfpara2 from '@salesforce/resourceUrl/Mfpara2';
import para4 from '@salesforce/resourceUrl/para4';
import farm from '@salesforce/resourceUrl/farm';
import img5 from '@salesforce/resourceUrl/img5';
import stichingwomen from '@salesforce/resourceUrl/stichingwomen';
import img3 from '@salesforce/resourceUrl/img3';
import MicroFinanceBanner from '@salesforce/resourceUrl/MicroFinanceBanner';
import MicrofinanceMobileBanner from '@salesforce/resourceUrl/MicrofinanceMobileBanner';
import getYourTransactionDetails from '@salesforce/apex/LWC_AllLoansCtrl.getYourTransactionDetails';
import Amount from '@salesforce/schema/Opportunity.Amount';

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


export default class CareDasboardtransactions extends LightningElement {

    @track isLoading = false;
  @track isSelected = false;
  @track showButton = true;
  @track screenWidth;
  @track screenHeight;
  @track contactid;
  @track transactions = [];
  @track type = 'All'
  @track showAll = true;
  columns = columns;

  lendLogo = LendWithCareImages + '/logo.png';
  Mfpara2 = Mfpara2;
  farm = farm;
  para4 = para4;
  img3 = img3;
  img5 = img5;
  stichingwomen = stichingwomen;
  isFilter = false;
  isSort = false;
  value = '';
  selectedfilterType = 'All';
  sortValue = 'MostRecent';
  fromAmount = '';
  toAmount = '';
  fromDate = '';
  toDate = '';
  filterValues = null;

  @wire(getYourTransactionDetails, { type: '$type', contactId: '$contactid', showAll: '$showAll', sortValue: '$sortValue', filterValues: '$filterValues'}) //: { type: "All", fromAmount: "100", toAmount: "200", fromDate: "2023-08-10", toDate: "2023-09-22" }
  wiredTransactionData({ error, data }) {
    this.isLoading = false;

    // let formattedDate = new Date(data[0].Completed_Date__c).toLocaleDateString("en-GB");
    console.log('@wire DATA: ' + JSON.stringify(this.type)+'  , '+JSON.stringify(this.contactid)+' , '+JSON.stringify(this.showAll)+' , '+JSON.stringify(this.showAll)+' , '+JSON.stringify(this.sortValue)+' , '+JSON.stringify(this.filterValues));

    if (data) {
      this.transactions = data.map((transaction) => ({
        ...transaction,
        disableDownloadButton: transaction.Type__c !== 'Donation',
        downloadButtonClass: transaction.Type__c === 'Donation' ? 'slds-show' : 'slds-hide',
      }));
    } else {
      console.error('Error loading data:', error);
    }
  }

  formatCompletedDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

  openFilter() {
    this.isFilter = true;
    this.isSort = false;
  }

  closeFilterMenu() {
    this.isFilter = false;
  }
  resetFiltervalues(){
  location.reload();
  selectedfilterType = 'All';
  sortValue = 'MostRecent';
  fromAmount = '';
  toAmount = '';
  fromDate = '';
  toDate = '';
  filterValues = null;
  }

  openSort() {
    this.isFilter = false;
    this.isSort = true;
  }

  closeSortMenu() {
    this.isSort = false;
  }


  // Get Options on clicking of radio button

  get MostRecentradioOptions() {
    return [
      { label: '', value: 'MostRecent' },

    ];
  }
  get OldestradioOptions() {
    return [
      { label: '', value: 'Oldest' },

    ];
  }
  get HighestLowestradioOptions() {
    return [
      { label: '', value: 'HighestLowest' },

    ];
  }
  get LowestHighestradioOptions() {
    return [
      { label: '', value: 'LowestHighest' },

    ];
  }
  MostRecentChange(event) {
    this.sortValue = 'MostRecent';
    this.isLoading = true;
    console.log('sortValue: ' + this.sortValue);
  }
  OldestChange(event) {
    this.sortValue = 'Oldest';
    this.isLoading = true;
    console.log('sortValue: ' + this.sortValue);

  }
  HighestLowestChange(event) {
    this.sortValue = 'HighestLowest';
    this.isLoading = true;
    console.log('sortValue: ' + this.sortValue);
  }
  LowestHighestChange(event) {
    this.sortValue = 'LowestHighest';
    this.isLoading = true;
    console.log('sortValue: ' + this.sortValue);
  }

  get backgroundImage() {

    this.getScreenSize();



    if (this.screenWidth <= 414 && this.screenHeight <= 915) {
      return MicrofinanceMobileBanner;
      //return `background-image: url('${this.OurImpactBanner1}');background-size: cover; background-repeat: no-repeat;`;
    }
    else {
      return MicroFinanceBanner;
      //return `background-image: url('${this.OurImpactBanner}');background-size: cover; background-repeat: no-repeat;Height:532px;`;
    }

  }
  connectedCallback() {
    this.extractContactIdFromUrl();
    this.getScreenSize();
    window.addEventListener('resize', this.getScreenSize.bind(this));
    console.log('transactions connected call back ')
  }
  disconnectedCallback() {
    window.removeEventListener('resize', this.getScreenSize);
  }

  getScreenSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  extractContactIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    var Id = urlParams.get('Id');
    //this.contactid = atob(Id); // decrypt the ID from care dashboard
    this.contactid = Id;
    console.log('this.contactId @@@ : ' + this.contactid);
  }

  handleButtonClick(event) {
    this.type = event.target.dataset.type;
    if (this.selectedType === this.type) {
      this.selectedType = ''; // Unselect if clicked again
    } else {
      this.selectedType = this.type;
    }
    this.isLoading = event.target.dataset.type === 'All' ? false : true;
    this.refreshData();
    this.isSelected = !this.isSelected;
    console.log('@@@@@dataset' + event.target.dataset.type);
  }
  refreshData() {
    refreshApex(this.wiredTransactionData).then(() => {
      // Reset isLoading after data has been refreshed
      this.isLoading = false;
    });
  }

  get onSelection() {
    return this.selectedType === '' ? '' : 'selected';
  }

  handleFilterClick(event) {
    this.selectedfilterType = event.target.dataset.type;
    this.type = this.selectedfilterType;
    console.log('Selected Filter Type:', this.selectedfilterType);
  }
  // Handle changes for Transaction Amount - From input
  handleFromInputChange(event) {
    this.fromAmount = event.target.value;
  }

  // Handle changes for Transaction Amount - To input
  handleToInputChange(event) {
    this.toAmount = event.target.value;
  }

  // Handle changes for Date Range - From input
  handleFromDateChange(event) {
    this.fromDate = event.target.value;
  }

  // Handle changes for Date Range - To input
  handleToDateChange(event) {
    this.toDate = event.target.value;
  }

  applyFilters() {
    this.isLoading = true;
    this.transactions = [];
    // Prepare filter values
     this.filterValues = {
        type: this.selectedfilterType,
        fromAmount: this.fromAmount,
        toAmount: this.toAmount,
        fromDate: this.fromDate,
        toDate: this.toDate
    };
    this.isFilter = false;
    console.log('this.filterValues:: ' + JSON.stringify(this.filterValues));
    // Call wire method with filter values
    this.refreshData();
}

// const jsDate = new Date(); // Some JavaScript date
// const formattedDate = jsDate.toLocaleDateString("en-GB"); // Format as per en-GB locale
// console.log(formattedDate);


}
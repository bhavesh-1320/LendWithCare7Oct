import { LightningElement } from 'lwc';
import getLoanSchedules from '@salesforce/apex/LWC_AllLoansCtrl.getLoanSchedules';
export default class CareAllLoanSchedules extends LightningElement {
    borrowerspage;
    loanId;
    repaymentSchedules;
    getUrlParamValue(url, key){
        return new URL(url).searchParams.get(key);
    }
    connectedCallback(){

        this.loanId = this.getUrlParamValue(window.location.href, 'loanId');
        this.loanId = atob( this.loanId );
        console.log('this.loanId from loan schedules ', this.loanId)
        const currentPageUrl = window.location.href;
        var currentPageUrl2 = currentPageUrl.substring(0, currentPageUrl.indexOf('/s') + 3);
        this.borrowerspage = currentPageUrl2+'careborrowers?loanId='+btoa(this.loanId);
        getLoanSchedules({'loanId':this.loanId}).then( data=>{
            if( data!=undefined ){
                console.log('LoanRecords:',data);
                var i = 1;
                var repaySchedules=[];
                var cMap = data.CurrencyType;
                for(var val of data.RSch){
                    console.log('vv:', val);
                    var dueDate = val.Due_Date__c != undefined ? val.Due_Date__c : '-';
                    var expectedAmount = val.Amount_Due__c != undefined ? val.Amount_Due__c : '-';
                    if( cMap!=undefined && expectedAmount!='-' ){
                        var cAmt = cMap[val.CurrencyIsoCode]!=undefined ? cMap[val.CurrencyIsoCode] : 1;
                        expectedAmount = expectedAmount/cAmt;
                    }
                    var repayDate = val.Repayment_Date__c != undefined ? val.Repayment_Date__c : '-';
                    var obj = {'dueDate':dueDate, 'expectedAmount':expectedAmount, 'repayDate':repayDate};
                    obj.classes = i%2==0 ? 'slds-grid tableTitleContentSecond' : 'slds-grid tableTitleContent';
                    repaySchedules.push( obj );
                    i++;
                }
                this.repaymentSchedules = repaySchedules;
            }
        } ).catch(err=>{

        });
    }
}
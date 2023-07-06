import { LightningElement, track } from 'lwc';
import searchProject from '@salesforce/apex/bryntumGanttController.searchProject';
import searchUsers from '@salesforce/apex/bryntumGanttController.searchUsers';
import getFieldSet from '@salesforce/apex/bryntumGanttController.getFieldSet';
import fetchScheduleList from '@salesforce/apex/bryntumGanttController.fetchScheduleList';
import getScheduleItemList from '@salesforce/apex/bryntumGanttController.getScheduleItemList';

export default class Create_New_Schedule extends LightningElement {

    @track searchProjectName = '';
    @track suggestedProjectName = [];
    @track showProjectName = false;

    @track searchProjectManager = '';
    @track suggestedProjectManagerName = [];
    @track showProjectManagerName = false;
    @track searchbarValue = '';
    @track masterId = '';
    @track listOfFields = [];
    @track scheduleLineItems;

    connectedCallback(event) {
        document.addEventListener('click', this.handleDocumentEvent.bind(this));
        this.getFields();
    }

    handleProjectSearch(event) {
        try {
            this.searchProjectName = event.target.value;
            this.searchbarValue = event.target.dataset.id;
            console.log(`searchProjectName: ${this.searchProjectName}`);
            if (this.searchProjectName.length >= 3) {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    searchProject({ searchProjectName: this.searchProjectName })
                        .then((result) => {
                            this.suggestedProjectName = result;
                            console.log('result', result);
                            this.showProjectName = true;
                        })
                        .catch((error) => {
                            console.log('error:', JSON.stringify(error));
                        });
                }, 300);
            } else {
                this.showProjectName = false;
                this.suggestedProjectName = [];
            }
        } catch (error) {
            console.log('error', JSON.stringify(error));
        }
    }

    handleProjectManagerSearch(event) {
        try {
            this.searchProjectManager = event.target.value;
            this.searchbarValue = event.target.dataset.id;
            console.log(`searchProjectManager: ${this.searchProjectManager}`);
            if (this.searchProjectManager.length >= 3) {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    searchUsers({ searchProjectManagerName: this.searchProjectManager })
                        .then((result) => {
                            this.suggestedProjectManagerName = result;
                            console.log('result', result);
                            this.showProjectManagerName = true;
                        })
                        .catch((error) => {
                            console.log('error:', JSON.stringify(error));
                        });
                }, 300);
            } else {
                this.showProjectManagerName = false;
                this.suggestedProjectManagerName = [];
            }
        } catch (error) {
            console.log('error', JSON.stringify(error));
        }
    }

    handleDocumentEvent(event) {
        const clickedElement = event.target;
        const componentElement = this.template.querySelector('.detailContainer');
        if (componentElement && !componentElement.contains(clickedElement)) {
            console.log('handleDocumentEvent condition');
            this.showProjectName = false;
            this.showProjectManagerName = false;
        }
    }

    selectedRecord(event) {
        const selectedValue = event.target.innerText;
        console.log('selectedValue', selectedValue);
        console.log('searchbarValue', this.searchbarValue);

        if (this.searchbarValue === 'project') {
            this.searchProjectName = selectedValue;
        } else {
            this.searchProjectManager = selectedValue;
        }

    }

    getFields() {
        getFieldSet()
            .then((result) => {
                console.log('getFieldSet', JSON.parse(result));
                this.listOfFields = JSON.parse(result);
            })
            .catch((error) => {
                console.log('error', JSON.stringify(error));
            })
        fetchScheduleList()
            .then((result) => {
                this.masterId = result;
                console.log('masterId', this.masterId);
            })
            .catch((error) => {
                console.log('error', JSON.stringify(error));
            })
    }

    saveSelectedPO(event) {
        let masterId = event.target.dataset.id;
        console.log('masterid', masterId);
        getScheduleItemList({ masterId: masterId })
            .then((result) => {
                this.scheduleLineItems = result;
                console.log('scheduleLineItems:', this.scheduleLineItems);
            })
            .catch((error) => {
                console.log('error', JSON.stringify(error));
            })
    }

    disconnectedCallback() {
        document.removeEventListener('click', this.handleDocumentEvent.bind(this));
    }

}
import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        //this.cards = [];
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        //this.loadNewData = this.loadNewData.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this)
        //your functions go here

        
    };

    init() {
        console.log('loaded init');
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        console.log('loaderData',loaderData);
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //this.setState({ loaderData })
        //)
        
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.loadData();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');

       // your ajax call and other logic goes here
       var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: { showActive: "true", showExpired: "true", showUnexpired: "true"},
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log("getSortedEmployerJobs ", res);
                let employerJobData = null;
                if (res.myJobs) {
                    employerJobData = res.myJobs;                    
                    console.log("employerJobData", employerJobData);
                    //this.setState({ employerJobData })
                    this.updateWithoutSave(employerJobData);
                   
                }
                
                
                
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        }) 
        this.init()
    }
    updateWithoutSave(newData) {
        console.log('updateWithoutSave',newData);
        //let newJob = Object.assign({}, this.state.loadJobs, newData)
        this.setState({
            loadJobs: newData
        });
        loaderData.isLoading = false;
        this.renderDisplay(newData);

    }
    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    renderDisplay(data){
        let cards=[];

        
        if(data!=undefined && data.length>0){
            console.log('loaded render display');
        for (let i = 0; i < data.length; i++) {
            let card=<Card key={data[i].id}>
            <Card.Content >
              <Card.Header >{data[i].title}</Card.Header>
              <Card.Meta>job</Card.Meta>
              <Card.Description>{data[i].summary}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className='ui two buttons'>
                {/* <Button basic color='green'>
                  Update
                </Button>
                <Button basic color='red'>
                  Close
                </Button> */}
              </div>
            </Card.Content>
          </Card>
          cards.push(card);
          }
          
        }

        return cards;

    }

    render() {
        
      
        return (
            <BodyWrapper loaderData={this.state.loaderData} reload={this.loadData}>
              <div className ="ui container">                                
                  <Card.Group >{this.renderDisplay(this.state.loadJobs)}</Card.Group>
              </div>
            </BodyWrapper>
        )
    }
}
import { AppComponent } from './../app.component';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
interface tAparams {
  startDate : string,
  endDate: string,
  reason: number,
  note: string,
  vidx: string;
}

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
 
})
export class PlansComponent implements OnInit {
  panelOpenState: boolean;
  vacData: any;
  vacEdit: any;
  users: any;
  calDates: Date[];                                                         // the dates used to draw the calendat
  dayNum: number;
  vacDays: number;
  dayOfMonth: number;
  setStart: any;
  currentItem:any;
  prop1: any;
  showEdit: boolean;
  tAparams: tAparams;
  reasonIdx: string;
  reason: string;
  
  constructor(private http: HttpClient, private datePipe: DatePipe ) { }

  ngOnInit(): void {
    this .dayOfMonth = new Date().getDate();
    this. dayNum = 1;
    this. vacDays = 1;
    this .currentItem = "test"
    this .showEdit = false;
    this .reasonIdx = "1";
    this .reason = 'Personal Vacation'

    this .vacData = Array();
    this.getVacs().subscribe(res =>{
      console.log(" res is %o", res)
      this.getUsers().subscribe(rusers=>{
        this .users = rusers;
    //    console.log("41 this.userw %o", this .users)
      })

     this .vacData = res;
      console.log("vacData is %o", this. vacData)
    })
    this. setCalDates();
  }
private  editDate(type: string, ev: MatDatepickerInputEvent<Date>) {
    console.log("53 %o --%o", type, ev.value)
    let dateString = this.datePipe.transform(ev.value, 'yyyy-MM-dd')
    if (type.indexOf("start") >= 0){
      this .tAparams.startDate = dateString;
    }
    if (type.indexOf("end") >= 0){
      this .tAparams.endDate = dateString;
    }
}
private saveEdits() {
  var jData = JSON.stringify(this .tAparams)                        // form the data to pass to php script
  var url = 'https://whiteboard.partners.org/esb/FLwbe/vacation/editAngVac.php';  // set endPoint
  this .http.post(url, jData).subscribe(res =>{                     // do the http.post
    this .getVacs().subscribe(get => {                              // reload the vacData
      this .vacData = get;                                          // store the new vacData
    })
  })
}
private editReasonIdx(ev){
  console.log("66 %o", ev)
  
}
 private showEditFunc(vacEdit){
   console.log("49 %o", vacEdit)
   this .tAparams ={} as tAparams;
   this .tAparams.vidx  = vacEdit.vidx;
  
   this .vacEdit = vacEdit;
  
   this. showEdit = true;
 } 
 public doSomething(ev){                                            // access point for enterData component
    console.log("49 in PlansComponent.ts ev %o", ev)
    this .showEdit = false;
    this .getVacs().subscribe(res =>{
      this. vacData = res;
    })
 }

 public newItemEvent(ev){
   console.log("53")
 }
 dataFromChild:any
 public eventFromChild(data) {
   console.log("53")
 }


  getDateClass(d: Date){
    let today = new Date()
    let dDate = d.getDate();
    let todayDate = today.getDate();
    if (d.getDate() === today.getDate()  && 
       d.getMonth() === today.getMonth()  &&
       d.getFullYear() === today.getFullYear()) 
      return 'todayCell'
    if (d.getDay() == 6  || d.getDay() == 0)
        return 'weekend'
  }
  getClass(){
    if (this. dayNum == this .dayOfMonth)
    return 'todayCell'
  }

  //showIp(ip: number){
  //  return ip;
 // }
  //getDayNum(){
  //  return this. dayNum;
 // }
  zeroDayNum(){                                         // reset the dayNum for each row of Cal
    this. dayNum = -1;
  }
  //addVacDays(n: number){
  //  this. vacDays = this. vacDays + n;
  //}
  incDay(n: number){                                  // increment the dayNum of a Cal call. 
    this. dayNum = this. dayNum + n;
    if (this. dayNum == this .dayOfMonth -1)
      return 'todayCell'
    return this. dayNum +1;
  }
  incDay1(n: number, m: number){
    this. dayNum = this. dayNum + n;
    if ( this. dayNum + m + 1 == this. dayOfMonth)
      return "todayCell"
   // return this. dayNum + m + 1;
  }
 // incDay2(n: number, m: number){
  //  this. dayNum = this. dayNum + n;
  //  return this. dayNum + m + 1;
 // }

  getVacs(){
    var url = 'https://whiteboard.partners.org/esb/FLwbe/vacation/getVacs.php';
    var url = 'https://whiteboard.partners.org/esb/FLwbe/vacation/getMDtAs.php';
    return this .http.get(url)
  }
  getUsers(){
    var url = 'https://ion.mgh.harvard.edu/cgi-bin/imrtqa/getUsers.php';
    return this .http.get(url)
  }
//  setUsers(res){
//    this. users = res;
//  }
  setData(res ) {
    this.getUsers().subscribe(res =>{
      this .users = res;
    })
    this.vacData = res;
    console.log(this.vacData)
 }
 counter(n){                                            // used for looper in Calendar
      var ar = Array();
      for (var i=0; i < n; i++ ){
        ar[i] = i;
      }
      return ar;
  }

  setCalDates(){
      var date = new Date();
      var daysInMonth0 = date.getDate();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 2, 0);
      this. calDates = Array();
      var i = 0;
      do {
        var cDay = new Date(firstDay.valueOf());
        this. calDates[i++] = cDay;
        firstDay.setDate(firstDay.getDate() + 1);
      }
      while (firstDay <= lastDay)
    }
  daysTillEnd(val){
      const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var endDate = new Date(val['endDate'])
      var calEndDate = new Date( this. calDates[this. calDates.length-1])
      var diff =Math.round( (calEndDate.valueOf() - endDate.valueOf())/oneDay);
     return diff;
    }
  daysBetween(val1, val2){
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var endDate = new Date(val1['endDate'])
    var calEndDate = new Date( val2['startDate'])
    var diff =Math.round( (calEndDate.valueOf() - endDate.valueOf())/oneDay);

    return diff -1;
  }  
  daysBetweenX(val1, val2){

    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var endDate = new Date(val1['endDate'])
    var calEndDate = new Date( val2['startDate'])
    var diff =Math.round( (calEndDate.valueOf() - endDate.valueOf())/oneDay);

    return diff;
  }  
}

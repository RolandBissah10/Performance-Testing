/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.15328467153284, "KoPercent": 0.8467153284671532};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5142424242424243, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.19, 500, 1500, "05 - Open Assessment 5121"], "isController": true}, {"data": [0.0, 500, 1500, "ListPerformanceProjects"], "isController": false}, {"data": [0.67, 500, 1500, "GetPendingRecipientsOnReport"], "isController": false}, {"data": [0.26, 500, 1500, "46 - Project Manager - Feedback Requests (8)"], "isController": true}, {"data": [0.33666666666666667, 500, 1500, "GetEmployeeCdcReports"], "isController": false}, {"data": [0.52, 500, 1500, "56 - Config - CDC Cycle Overview"], "isController": true}, {"data": [1.0, 500, 1500, "44 - AI Enhance Text (assessment 5195)"], "isController": true}, {"data": [0.64, 500, 1500, "GetConsolidatedFeedbackByUserAndProject"], "isController": false}, {"data": [0.66, 500, 1500, "GetLiveAppraisalSessionReports"], "isController": false}, {"data": [1.0, 500, 1500, "07 - Change Assessor - Submit"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "ListProjectStaffByAccountManager"], "isController": false}, {"data": [0.01, 500, 1500, "42 - Project Manager - Feedback Requests (7)"], "isController": true}, {"data": [0.0, 500, 1500, "47 - Change Assessor 5194 - Load Project Staff"], "isController": true}, {"data": [0.17, 500, 1500, "GetAllPerformanceCycleTemplates"], "isController": false}, {"data": [1.0, 500, 1500, "12 - Save Assessment 5113"], "isController": true}, {"data": [0.77, 500, 1500, "ListPerformanceUserProjects"], "isController": false}, {"data": [0.52, 500, 1500, "19 - My Projects - Self Consolidated Feedback"], "isController": true}, {"data": [0.768, 500, 1500, "GetAdviseesWithCdcData"], "isController": false}, {"data": [0.08, 500, 1500, "40 - PM - View Employee 631 (5)"], "isController": true}, {"data": [0.12, 500, 1500, "55 - Config - Performance Cycles"], "isController": true}, {"data": [0.805, 500, 1500, "GetPerformanceHistoryByUserId"], "isController": false}, {"data": [0.24, 500, 1500, "48 - Change Assessor 5194 - Submit"], "isController": true}, {"data": [0.76, 500, 1500, "GetProjectConfigurationPage"], "isController": false}, {"data": [0.0, 500, 1500, "29 - Request Feedback - Open Dialog"], "isController": true}, {"data": [0.69, 500, 1500, "50 - Config - Project Staff"], "isController": true}, {"data": [0.07, 500, 1500, "36 - PM - View Employee 538"], "isController": true}, {"data": [0.635, 500, 1500, "GetAllPerformanceDepartments"], "isController": false}, {"data": [0.77, 500, 1500, "GetProjectFeedbackConfig"], "isController": false}, {"data": [0.6, 500, 1500, "52 - Config - Create Competency"], "isController": true}, {"data": [0.0, 500, 1500, "60 - Config - Access Levels"], "isController": true}, {"data": [0.24, 500, 1500, "54 - Config - Questionnaires Pagination"], "isController": true}, {"data": [0.3, 500, 1500, "13 - My Feedback Tasks - List IN_PROGRESS"], "isController": true}, {"data": [0.73, 500, 1500, "18 - Legacy Assessments"], "isController": true}, {"data": [0.76, 500, 1500, "GetEmployeeCdcReportHistory"], "isController": false}, {"data": [0.68, 500, 1500, "GetAllAdviseeFeedback"], "isController": false}, {"data": [0.554, 500, 1500, "getUnifiedHistoryAssessmentList"], "isController": false}, {"data": [0.58, 500, 1500, "GetCdcConsolidatedOverview"], "isController": false}, {"data": [0.47, 500, 1500, "45 - Save Assessment 5195"], "isController": true}, {"data": [0.38, 500, 1500, "GetCandidateAssessmentResults"], "isController": false}, {"data": [0.15, 500, 1500, "15 - Open Assessment 5112"], "isController": true}, {"data": [0.73, 500, 1500, "GetLegacyAssessmentsByUserId"], "isController": false}, {"data": [0.03, 500, 1500, "39 - Project Manager - Feedback Requests (6)"], "isController": true}, {"data": [0.0, 500, 1500, "22 - Advisee - Consolidated CDC View"], "isController": true}, {"data": [0.06, 500, 1500, "34 - PM - View Employee 631 (3)"], "isController": true}, {"data": [0.58, 500, 1500, "31 - PM - Staff List"], "isController": true}, {"data": [0.64, 500, 1500, "41 - PM - Consolidated Feedback 631"], "isController": true}, {"data": [1.0, 500, 1500, "02 - AI Enhance Text (assessment 5118)"], "isController": true}, {"data": [0.03, 500, 1500, "35 - Project Manager - Feedback Requests (4)"], "isController": true}, {"data": [0.26, 500, 1500, "04 - My Feedback Tasks - List"], "isController": true}, {"data": [0.31, 500, 1500, "GetPeersForUsers"], "isController": false}, {"data": [0.04, 500, 1500, "16 - My Feedback Tasks - Back to List"], "isController": true}, {"data": [0.52, 500, 1500, "GetCdcOverviewPage"], "isController": false}, {"data": [0.54, 500, 1500, "51 - Config - Competencies"], "isController": true}, {"data": [0.31, 500, 1500, "getPastCDCReports"], "isController": false}, {"data": [0.04, 500, 1500, "21 - Advisees - CDC Reports"], "isController": true}, {"data": [0.05, 500, 1500, "GetAdviseeConsolidatedView"], "isController": false}, {"data": [0.0, 500, 1500, "GetStaffByProjectId"], "isController": false}, {"data": [0.01, 500, 1500, "GetAllPerformanceAccessLevels"], "isController": false}, {"data": [0.0, 500, 1500, "17 - CDC Insights"], "isController": true}, {"data": [0.17, 500, 1500, "14 - My Feedback Tasks - List All"], "isController": true}, {"data": [0.667, 500, 1500, "GetFeedbackRequestByProjectManager"], "isController": false}, {"data": [0.0, 500, 1500, "06 - Change Assessor - Load Project Staff"], "isController": true}, {"data": [0.06, 500, 1500, "32 - PM - View Employee 631 (2)"], "isController": true}, {"data": [0.78, 500, 1500, "GetPerformanceAuditActions"], "isController": false}, {"data": [0.11, 500, 1500, "37 - Project Manager - Feedback Requests (5)"], "isController": true}, {"data": [0.5, 500, 1500, "09 - My Feedback Tasks - Filter PENDING"], "isController": true}, {"data": [0.0, 500, 1500, "GetPerformanceUsersByPositionIds"], "isController": false}, {"data": [0.03, 500, 1500, "01 - Open Assessment 5118"], "isController": true}, {"data": [0.7422222222222222, 500, 1500, "GetProjectsByStaffId"], "isController": false}, {"data": [0.05, 500, 1500, "28 - Project Manager - Feedback Requests (back)"], "isController": true}, {"data": [1.0, 500, 1500, "25 - Request Feedback from PM - Submit"], "isController": true}, {"data": [0.34, 500, 1500, "GetAllPerformancePositions"], "isController": false}, {"data": [0.79, 500, 1500, "GetUserProjectData"], "isController": false}, {"data": [0.39, 500, 1500, "43 - Open Assessment 5195"], "isController": true}, {"data": [0.21, 500, 1500, "11 - Open Assessment 5113"], "isController": true}, {"data": [0.8, 500, 1500, "GetPerformanceAuditCategories"], "isController": false}, {"data": [0.478, 500, 1500, "GetPerformanceAssessmentByIdWithExpectation"], "isController": false}, {"data": [1.0, 500, 1500, "30 - Request Feedback - Submit"], "isController": true}, {"data": [0.67, 500, 1500, "57 - Config - CDC Pending Recipients"], "isController": true}, {"data": [0.76, 500, 1500, "49 - Config - Projects"], "isController": true}, {"data": [0.32, 500, 1500, "GetPerformanceAuditLogs"], "isController": false}, {"data": [0.74, 500, 1500, "GetMyAdvisees"], "isController": false}, {"data": [0.77, 500, 1500, "10 - My Feedback Tasks - Filter IN_PROGRESS"], "isController": true}, {"data": [0.04, 500, 1500, "38 - PM - View Employee 631 (4)"], "isController": true}, {"data": [0.81, 500, 1500, "GetSelfConsolidatedProjectFeedback"], "isController": false}, {"data": [0.09, 500, 1500, "08 - My Feedback Tasks - List (refresh)"], "isController": true}, {"data": [0.4766666666666667, 500, 1500, "GetAllCompetencies"], "isController": false}, {"data": [0.19, 500, 1500, "20 - Advisees - Overview"], "isController": true}, {"data": [0.07, 500, 1500, "23 - Advisees - Back to List"], "isController": true}, {"data": [0.62, 500, 1500, "GetPeersForUserByUserId"], "isController": false}, {"data": [0.6133333333333333, 500, 1500, "GetAllQuestionnaires"], "isController": false}, {"data": [0.0, 500, 1500, "GetEmployeeCdcInsightHistory"], "isController": false}, {"data": [0.11, 500, 1500, "27 - PM - View Employee 631"], "isController": true}, {"data": [1.0, 500, 1500, "58 - Config - CDC Send Reminder"], "isController": true}, {"data": [0.8, 500, 1500, "24 - Request Feedback from PM - Load Projects"], "isController": true}, {"data": [0.37, 500, 1500, "GetEmployeeCdcInsight"], "isController": false}, {"data": [0.11, 500, 1500, "33 - Project Manager - Feedback Requests (3)"], "isController": true}, {"data": [0.1, 500, 1500, "26 - Project Manager - Feedback Requests"], "isController": true}, {"data": [0.15, 500, 1500, "53 - Config - Questionnaires"], "isController": true}, {"data": [0.53125, 500, 1500, "GetUnifiedCurrentAssessmentList"], "isController": false}, {"data": [0.11, 500, 1500, "61 - Config - Audit Logs"], "isController": true}, {"data": [1.0, 500, 1500, "03 - Save Assessment 5118"], "isController": true}, {"data": [0.0, 500, 1500, "59 - Config - Users & Peers"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6850, 58, 0.8467153284671532, 5645.739416058408, 126, 677284, 692.0, 3599.800000000001, 13394.9, 147770.35999999996, 3.080023507099117, 28.648493255170056, 8.042419820468352], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["05 - Open Assessment 5121", 50, 0, 0.0, 2061.0200000000004, 368, 7880, 1717.5, 3552.7999999999997, 4998.049999999992, 7880.0, 0.43758697041036904, 3.165240908036722, 3.8075194398011605], "isController": true}, {"data": ["ListPerformanceProjects", 50, 1, 2.0, 15922.699999999997, 1857, 218225, 4838.5, 28340.79999999998, 119373.14999999976, 218225.0, 0.0279156656574223, 1.2211337186904874, 0.05936331729392237], "isController": false}, {"data": ["GetPendingRecipientsOnReport", 50, 0, 0.0, 763.0000000000001, 143, 2485, 545.5, 1777.1, 1953.8, 2485.0, 0.027926127573253023, 0.061442934982948304, 0.06119749050232401], "isController": false}, {"data": ["46 - Project Manager - Feedback Requests (8)", 50, 1, 2.0, 3913.0999999999985, 421, 90814, 1523.5, 4927.199999999999, 7326.299999999998, 90814.0, 0.040319491651849254, 0.22065944292574358, 0.2887395345719481], "isController": true}, {"data": ["GetEmployeeCdcReports", 150, 1, 0.6666666666666666, 3969.293333333332, 231, 197306, 1281.0, 4379.200000000001, 6462.5999999999885, 145887.2900000009, 0.16446160205335794, 1.4696432235104437, 0.45802877385926694], "isController": false}, {"data": ["56 - Config - CDC Cycle Overview", 50, 1, 2.0, 4270.160000000002, 213, 75379, 760.0, 4529.199999999998, 36571.54999999977, 75379.0, 0.027921854547241543, 0.09691664806373107, 0.07690616742111518], "isController": true}, {"data": ["44 - AI Enhance Text (assessment 5195)", 50, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.040397185124140554, 0.0, 0.0], "isController": true}, {"data": ["GetConsolidatedFeedbackByUserAndProject", 50, 0, 0.0, 889.2200000000001, 160, 4651, 665.0, 1765.6999999999996, 3463.0999999999985, 4651.0, 0.03983749489084128, 0.06765371446794237, 0.10799695880564004], "isController": false}, {"data": ["GetLiveAppraisalSessionReports", 50, 0, 0.0, 874.82, 144, 5651, 461.5, 2190.7999999999993, 3408.4499999999953, 5651.0, 0.02789733334969977, 0.038522294293433075, 0.06925295056146173], "isController": false}, {"data": ["07 - Change Assessor - Submit", 50, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.08995540011262416, 0.0, 0.0], "isController": true}, {"data": ["ListProjectStaffByAccountManager", 750, 0, 0.0, 1126.4586666666657, 143, 53582, 632.5, 2088.1, 3309.0999999999985, 11921.530000000002, 0.3743486333779224, 1.2210199565256454, 0.9279751669594904], "isController": false}, {"data": ["42 - Project Manager - Feedback Requests (7)", 50, 2, 4.0, 8120.980000000001, 1490, 106796, 4168.5, 10167.499999999998, 44584.29999999974, 106796.0, 0.03984184381678489, 0.5367848040418753, 0.5875255709933846], "isController": true}, {"data": ["47 - Change Assessor 5194 - Load Project Staff", 50, 5, 10.0, 78753.84000000001, 7505, 675003, 17255.5, 339721.19999999984, 495937.29999999946, 675003.0, 0.027670692198967773, 3.3918215672015966, 0.08533868460308607], "isController": true}, {"data": ["GetAllPerformanceCycleTemplates", 50, 0, 0.0, 7202.620000000002, 591, 104204, 2051.5, 12360.399999999998, 47427.899999999805, 104204.0, 0.027886348628437828, 0.5927210721659661, 0.07434544116761257], "isController": false}, {"data": ["12 - Save Assessment 5113", 50, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.09019019307916534, 0.0, 0.0], "isController": true}, {"data": ["ListPerformanceUserProjects", 400, 0, 0.0, 551.7274999999998, 132, 5993, 326.5, 1097.8000000000002, 1650.2999999999997, 3286.1500000000024, 0.28161101211701783, 0.20680808702343498, 0.578622626459185], "isController": false}, {"data": ["19 - My Projects - Self Consolidated Feedback", 50, 0, 0.0, 1289.1400000000006, 266, 9688, 899.5, 2606.0, 4160.649999999995, 9688.0, 0.055214757800464906, 0.12018915540745731, 0.2561231440939534], "isController": true}, {"data": ["GetAdviseesWithCdcData", 250, 0, 0.0, 665.5279999999995, 134, 13477, 315.5, 1198.9000000000003, 1798.1999999999994, 8666.420000000073, 0.27241691556492187, 0.32136683008049377, 0.7115295726268945], "isController": false}, {"data": ["40 - PM - View Employee 631 (5)", 50, 0, 0.0, 4339.340000000001, 622, 62987, 2268.5, 7908.199999999999, 10258.849999999993, 62987.0, 0.03978816779466122, 0.32860208499946286, 0.37678306943831047], "isController": true}, {"data": ["55 - Config - Performance Cycles", 50, 0, 0.0, 8077.440000000002, 1042, 109855, 2610.0, 13793.099999999997, 48899.299999999814, 109855.0, 0.027874859719768462, 0.6309681381294073, 0.14351197308849542], "isController": true}, {"data": ["GetPerformanceHistoryByUserId", 100, 0, 0.0, 510.8999999999998, 135, 3002, 329.5, 1104.8, 1475.2499999999995, 2992.9399999999955, 0.11108951037298304, 0.10669583344905158, 0.26606154706029383], "isController": false}, {"data": ["48 - Change Assessor 5194 - Submit", 50, 0, 0.0, 2760.58, 283, 13287, 1728.5, 7288.299999999999, 10352.849999999999, 13287.0, 0.02789818946330021, 0.13164458152994787, 0.14390452807143722], "isController": true}, {"data": ["GetProjectConfigurationPage", 50, 0, 0.0, 679.52, 133, 4174, 305.5, 1799.1999999999996, 3461.2999999999997, 4174.0, 0.027914855225186344, 0.023226031886580827, 0.0636535028816505], "isController": false}, {"data": ["29 - Request Feedback - Open Dialog", 50, 7, 14.0, 142393.70000000004, 24840, 614097, 92347.0, 411891.29999999993, 446197.54999999993, 614097.0, 0.037764093748607445, 9.656837119545637, 0.4103430199964653], "isController": true}, {"data": ["50 - Config - Project Staff", 50, 0, 0.0, 702.8599999999998, 160, 3213, 517.0, 1565.7999999999997, 2302.2999999999997, 3213.0, 0.027906473129694215, 0.09102306665349481, 0.06916662969058977], "isController": true}, {"data": ["36 - PM - View Employee 538", 50, 0, 0.0, 3384.88, 736, 19356, 2370.5, 6744.799999999997, 13087.599999999962, 19356.0, 0.03989709740636949, 0.3240080683900085, 0.37781460307574705], "isController": true}, {"data": ["GetAllPerformanceDepartments", 100, 0, 0.0, 958.03, 133, 12263, 673.5, 1816.8, 3123.5999999999904, 12184.98999999996, 0.055731760805970434, 0.10232002960471134, 0.11962735376125294], "isController": false}, {"data": ["GetProjectFeedbackConfig", 50, 0, 0.0, 650.4599999999999, 132, 3452, 340.5, 1318.2999999999997, 3092.299999999999, 3452.0, 0.05629971264626665, 0.0725738483330781, 0.127609016652329], "isController": false}, {"data": ["52 - Config - Create Competency", 50, 0, 0.0, 1106.74, 151, 9169, 710.5, 2022.4999999999998, 4831.499999999993, 9169.0, 0.02791142699403421, 0.10444979320423739, 0.06953325220877077], "isController": true}, {"data": ["60 - Config - Access Levels", 50, 6, 12.0, 113656.22000000002, 11661, 495281, 35297.5, 364511.1999999999, 445747.8999999999, 495281.0, 0.027780833669481423, 4.603102912500931, 0.13549667546763478], "isController": true}, {"data": ["54 - Config - Questionnaires Pagination", 50, 1, 2.0, 4072.0399999999986, 336, 84935, 1575.0, 3956.7, 16308.199999999915, 84935.0, 0.02789815833097594, 0.19612023886542654, 0.13761039039706333], "isController": true}, {"data": ["13 - My Feedback Tasks - List IN_PROGRESS", 50, 0, 0.0, 3438.0400000000004, 323, 75554, 1446.0, 5505.499999999998, 7485.9, 75554.0, 0.08989814540126037, 0.49268397655456375, 0.4552849434091175], "isController": true}, {"data": ["18 - Legacy Assessments", 50, 0, 0.0, 613.5999999999999, 135, 1951, 467.5, 1282.0999999999997, 1581.7499999999986, 1951.0, 0.05524257567404229, 0.08922970719225189, 0.13535509996696493], "isController": true}, {"data": ["GetEmployeeCdcReportHistory", 150, 0, 0.0, 672.08, 143, 12666, 374.0, 1152.2000000000003, 1765.7499999999982, 8889.960000000068, 0.16457419717963714, 0.10880540184630307, 0.4811866663631187], "isController": false}, {"data": ["GetAllAdviseeFeedback", 300, 1, 0.3333333333333333, 1317.5466666666673, 142, 83724, 527.0, 1839.1000000000017, 3353.6999999999975, 17437.870000000054, 0.2151915168634832, 0.4926414700413957, 0.5185919418308638], "isController": false}, {"data": ["getUnifiedHistoryAssessmentList", 250, 2, 0.8, 2353.467999999999, 146, 110739, 840.0, 2844.8000000000025, 4573.6999999999925, 76971.90000000002, 0.40610852194366787, 1.9485959381634796, 1.0023551502276644], "isController": false}, {"data": ["GetCdcConsolidatedOverview", 50, 0, 0.0, 996.5000000000001, 144, 3246, 828.5, 1983.8, 2970.2999999999993, 3246.0, 0.05569590924685763, 0.1681211479316767, 0.14946519395543437], "isController": false}, {"data": ["45 - Save Assessment 5195", 50, 1, 2.0, 3439.5599999999995, 296, 83185, 902.5, 6368.699999999999, 11071.849999999979, 83185.0, 0.04038357939048256, 0.2302605442535378, 0.18257479341779964], "isController": true}, {"data": ["GetCandidateAssessmentResults", 50, 0, 0.0, 1513.2000000000003, 637, 13428, 1092.5, 2460.2999999999997, 3225.599999999997, 13428.0, 0.05564947951041813, 0.053747397691214394, 0.13836286604836384], "isController": false}, {"data": ["15 - Open Assessment 5112", 50, 0, 0.0, 5788.420000000001, 462, 100365, 2480.5, 6099.399999999999, 34557.24999999988, 100365.0, 0.08958454272466013, 0.9506984626844547, 0.7794905035905485], "isController": true}, {"data": ["GetLegacyAssessmentsByUserId", 50, 0, 0.0, 613.6, 135, 1951, 467.5, 1282.0999999999997, 1581.7499999999986, 1951.0, 0.05524257567404229, 0.08922970719225189, 0.13535509996696493], "isController": false}, {"data": ["39 - Project Manager - Feedback Requests (6)", 50, 0, 0.0, 3779.6000000000004, 620, 20791, 2961.5, 6730.099999999999, 7708.949999999996, 20791.0, 0.039869292511430524, 0.3474546546601621, 0.386389510628356], "isController": true}, {"data": ["22 - Advisee - Consolidated CDC View", 50, 0, 0.0, 15907.9, 4231, 102236, 8748.5, 44524.599999999984, 64583.799999999916, 102236.0, 0.05527958757005305, 2.177335552209912, 1.1996858150090712], "isController": true}, {"data": ["34 - PM - View Employee 631 (3)", 50, 0, 0.0, 3961.9600000000005, 781, 23825, 2103.5, 9078.499999999998, 15698.899999999989, 23825.0, 0.040126736283879, 0.33139825073512186, 0.37998922045388156], "isController": true}, {"data": ["31 - PM - Staff List", 50, 0, 0.0, 1153.8599999999997, 149, 9232, 665.0, 2740.4999999999995, 3620.849999999998, 9232.0, 0.03983473365700382, 0.12992969767030543, 0.09873100978659737], "isController": true}, {"data": ["41 - PM - Consolidated Feedback 631", 50, 0, 0.0, 889.2200000000001, 160, 4651, 665.0, 1765.6999999999996, 3463.0999999999985, 4651.0, 0.03983749489084128, 0.06765371446794237, 0.10799695880564004], "isController": true}, {"data": ["02 - AI Enhance Text (assessment 5118)", 50, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 2.3137436372049978, 0.0, 0.0], "isController": true}, {"data": ["35 - Project Manager - Feedback Requests (4)", 50, 0, 0.0, 2869.9999999999986, 1195, 8694, 2402.5, 5335.899999999999, 6917.999999999993, 8694.0, 0.03987886396282652, 0.3475380683635389, 0.3864822714522367], "isController": true}, {"data": ["04 - My Feedback Tasks - List", 50, 1, 2.0, 6209.9800000000005, 370, 104304, 1554.5, 7797.299999999996, 51588.14999999979, 104304.0, 0.44683950418688617, 4.6245619576485515, 2.232923330160773], "isController": true}, {"data": ["GetPeersForUsers", 50, 2, 4.0, 8285.480000000003, 300, 163507, 1394.5, 6315.599999999998, 74090.94999999937, 163507.0, 0.027996821800789173, 0.31307555341317655, 0.0661949855452409], "isController": false}, {"data": ["16 - My Feedback Tasks - Back to List", 50, 0, 0.0, 4341.139999999999, 978, 15801, 2951.0, 10791.799999999997, 13951.999999999993, 15801.0, 0.08966438620244425, 1.4297266581186618, 0.6821148130049226], "isController": true}, {"data": ["GetCdcOverviewPage", 50, 1, 2.0, 4270.160000000002, 213, 75379, 760.0, 4529.199999999998, 36571.54999999977, 75379.0, 0.027921854547241543, 0.09691664806373107, 0.07690616742111518], "isController": false}, {"data": ["51 - Config - Competencies", 50, 0, 0.0, 1145.22, 136, 5472, 778.5, 3178.8999999999987, 3812.4499999999994, 5472.0, 0.02793296089385475, 0.10453037709497207, 0.06958689769553073], "isController": true}, {"data": ["getPastCDCReports", 50, 0, 0.0, 1829.0400000000002, 197, 14034, 1374.5, 2721.5, 6044.949999999993, 14034.0, 0.05519525320822409, 0.12478223747757693, 0.1259141713812612], "isController": false}, {"data": ["21 - Advisees - CDC Reports", 50, 1, 2.0, 8171.16, 1033, 203724, 2770.5, 8710.8, 20024.149999999914, 203724.0, 0.055640747722624194, 0.6880467485911763, 0.6177307536567099], "isController": true}, {"data": ["GetAdviseeConsolidatedView", 50, 0, 0.0, 8839.46, 472, 83006, 3257.5, 25323.799999999992, 58227.94999999992, 83006.0, 0.055488784052079555, 1.2578180228680378, 0.18879191761469255], "isController": false}, {"data": ["GetStaffByProjectId", 200, 17, 8.5, 74481.78999999998, 7318, 675003, 18887.0, 244545.60000000027, 399928.7999999999, 568239.9400000002, 0.09373226409815268, 11.675088065123536, 0.293895957977717], "isController": false}, {"data": ["GetAllPerformanceAccessLevels", 50, 1, 2.0, 9488.279999999999, 857, 211548, 3485.5, 12668.399999999996, 28708.74999999995, 211548.0, 0.027969633927837224, 0.9186090907323736, 0.06906095939760121], "isController": false}, {"data": ["17 - CDC Insights", 50, 20, 40.0, 156217.70000000007, 25322, 683500, 116534.0, 378912.19999999995, 548083.7999999997, 683500.0, 0.05345986927992764, 8.436364144839894, 0.3422569744413711], "isController": true}, {"data": ["14 - My Feedback Tasks - List All", 50, 1, 2.0, 5897.98, 497, 111821, 1950.0, 7411.199999999997, 29493.599999999926, 111821.0, 0.08966776300451566, 0.926886209030799, 0.4480831217921358], "isController": true}, {"data": ["GetFeedbackRequestByProjectManager", 1000, 3, 0.3, 1243.4869999999996, 135, 105090, 583.5, 1838.1, 3159.8999999999996, 11455.08000000002, 0.5003071886138089, 1.1818868113146472, 1.2864715341469664], "isController": false}, {"data": ["06 - Change Assessor - Load Project Staff", 50, 5, 10.0, 78525.51999999999, 12341, 548929, 23135.5, 175601.09999999998, 417579.7999999999, 548929.0, 0.0873875322459994, 10.709321595294357, 0.2695103179551667], "isController": true}, {"data": ["32 - PM - View Employee 631 (2)", 50, 1, 2.0, 5227.98, 714, 96364, 2506.0, 6468.199999999998, 14895.299999999996, 96364.0, 0.04009208349737677, 0.33195618697023327, 0.3777222399406958], "isController": true}, {"data": ["GetPerformanceAuditActions", 50, 0, 0.0, 727.48, 127, 12261, 296.0, 1337.8999999999992, 2802.7499999999914, 12261.0, 0.02875047007018565, 0.017997120424793945, 0.05671479447438965], "isController": false}, {"data": ["37 - Project Manager - Feedback Requests (5)", 50, 0, 0.0, 3684.86, 745, 32561, 2886.0, 5578.599999999999, 11192.049999999977, 32561.0, 0.03983952638771031, 0.3471952475428972, 0.38610103503089555], "isController": true}, {"data": ["09 - My Feedback Tasks - Filter PENDING", 50, 0, 0.0, 1342.2199999999998, 154, 16832, 907.5, 2476.2999999999993, 2888.999999999999, 16832.0, 0.09014888990656969, 0.5018053442064914, 0.23127063846148296], "isController": true}, {"data": ["GetPerformanceUsersByPositionIds", 50, 5, 10.0, 104167.94, 7929, 491652, 25838.5, 360785.9999999999, 427888.94999999995, 491652.0, 0.027898749857018908, 3.7063598164541247, 0.06718585658926624], "isController": false}, {"data": ["01 - Open Assessment 5118", 50, 0, 0.0, 4084.3199999999997, 1061, 15975, 3068.5, 7545.199999999998, 13991.549999999996, 15975.0, 2.1555440593205724, 22.88792046581307, 18.755759344283497], "isController": true}, {"data": ["GetProjectsByStaffId", 450, 0, 0.0, 784.8466666666673, 134, 15131, 366.5, 1461.900000000001, 2215.0999999999995, 8099.4200000000255, 0.21540345306095487, 0.3312622765009672, 0.5078903032784884], "isController": false}, {"data": ["28 - Project Manager - Feedback Requests (back)", 50, 0, 0.0, 3946.9200000000023, 1221, 26640, 2578.5, 6046.5, 16186.949999999993, 26640.0, 0.056054565756489996, 0.48850678204191084, 0.5432475689134831], "isController": true}, {"data": ["25 - Request Feedback from PM - Submit", 50, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.055923782595176684, 0.0, 0.0], "isController": true}, {"data": ["GetAllPerformancePositions", 50, 2, 4.0, 7146.379999999999, 355, 139187, 1296.5, 5689.5999999999985, 65424.74999999966, 139187.0, 0.055066807050313436, 0.6114265483134138, 0.11837642678097067], "isController": false}, {"data": ["GetUserProjectData", 300, 0, 0.0, 574.6033333333337, 129, 8344, 310.0, 1195.7, 1446.55, 5399.460000000001, 0.2149218830595706, 0.19522770660082414, 0.4768579280384223], "isController": false}, {"data": ["43 - Open Assessment 5195", 50, 0, 0.0, 3590.599999999999, 308, 60661, 1014.0, 4016.599999999999, 22551.649999999987, 60661.0, 0.040338488323217785, 0.23194630785850226, 0.18609279183484456], "isController": true}, {"data": ["11 - Open Assessment 5113", 50, 0, 0.0, 2342.3600000000006, 621, 14574, 1646.0, 4469.7, 9138.299999999992, 14574.0, 0.09013475145342287, 0.9512561122628329, 0.7842779643066384], "isController": true}, {"data": ["GetPerformanceAuditCategories", 50, 0, 0.0, 542.1599999999997, 126, 3525, 307.5, 1399.6999999999994, 2245.349999999995, 3525.0, 0.028760607631109544, 0.018649456510797593, 0.056987571175313737], "isController": false}, {"data": ["GetPerformanceAssessmentByIdWithExpectation", 500, 1, 0.2, 2130.628, 168, 95657, 937.5, 3281.0, 5622.299999999998, 24321.23000000003, 0.317993537099352, 1.6048947493066152, 1.3972313057959411], "isController": false}, {"data": ["30 - Request Feedback - Submit", 50, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.03983467018486474, 0.0, 0.0], "isController": true}, {"data": ["57 - Config - CDC Pending Recipients", 50, 0, 0.0, 763.0000000000001, 143, 2485, 545.5, 1777.1, 1953.8, 2485.0, 0.027926127573253023, 0.061442934982948304, 0.06119749050232401], "isController": true}, {"data": ["49 - Config - Projects", 50, 0, 0.0, 679.52, 133, 4174, 305.5, 1799.1999999999996, 3461.2999999999997, 4174.0, 0.027914855225186344, 0.023226031886580827, 0.0636535028816505], "isController": true}, {"data": ["GetPerformanceAuditLogs", 50, 0, 0.0, 2407.4, 302, 28682, 1391.0, 4073.8999999999996, 6630.599999999994, 28682.0, 0.028743759729762668, 0.2357886540332094, 0.07592956061426565], "isController": false}, {"data": ["GetMyAdvisees", 50, 0, 0.0, 743.46, 148, 5083, 376.5, 1758.3999999999992, 2992.29999999999, 5083.0, 0.055760133289022615, 0.0927883468012642, 0.15715209440636646], "isController": false}, {"data": ["10 - My Feedback Tasks - Filter IN_PROGRESS", 50, 0, 0.0, 644.24, 140, 5390, 370.5, 1421.8999999999996, 2157.8999999999996, 5390.0, 0.09017620430320847, 0.06023488646815878, 0.23169296242357565], "isController": true}, {"data": ["38 - PM - View Employee 631 (4)", 50, 0, 0.0, 4175.300000000002, 1006, 23623, 2723.0, 8614.599999999999, 14739.049999999987, 23623.0, 0.03990292416608874, 0.3295498336646606, 0.3778697808970337], "isController": true}, {"data": ["GetSelfConsolidatedProjectFeedback", 50, 0, 0.0, 491.24000000000024, 131, 3384, 250.5, 1190.3999999999996, 1272.75, 3384.0, 0.05523177461901122, 0.04012933624662534, 0.12621323496922487], "isController": false}, {"data": ["08 - My Feedback Tasks - List (refresh)", 50, 0, 0.0, 3342.5799999999995, 944, 14179, 2386.5, 6482.4, 9226.3, 14179.0, 0.08951701987098806, 0.9290887570203723, 0.4517812096613929], "isController": true}, {"data": ["GetAllCompetencies", 150, 0, 0.0, 1579.3799999999999, 136, 16494, 905.0, 3590.9000000000005, 6243.949999999989, 14577.930000000035, 0.08335412555687502, 0.5035978419061199, 0.20689297114947008], "isController": false}, {"data": ["20 - Advisees - Overview", 50, 2, 4.0, 8279.199999999999, 529, 139669, 1988.0, 9220.699999999999, 72455.1999999996, 139669.0, 0.05505746898612772, 0.6762734723754654, 0.262129470115907], "isController": true}, {"data": ["23 - Advisees - Back to List", 50, 0, 0.0, 5154.299999999998, 942, 97700, 3010.5, 6154.299999999999, 6795.449999999998, 97700.0, 0.055589712345474496, 0.6667508271749197, 0.6087724943771006], "isController": true}, {"data": ["GetPeersForUserByUserId", 50, 0, 0.0, 1095.4400000000003, 135, 4701, 656.5, 4036.2999999999993, 4393.2, 4701.0, 0.039839812083574365, 0.05267881402457, 0.08866692552584568], "isController": false}, {"data": ["GetAllQuestionnaires", 150, 1, 0.6666666666666666, 1654.5800000000004, 138, 82883, 700.0, 2279.2000000000003, 2947.099999999999, 54181.73000000051, 0.08347997983123688, 0.28570099165172375, 0.20657979722573766], "isController": false}, {"data": ["GetEmployeeCdcInsightHistory", 50, 19, 38.0, 149871.75999999998, 21716, 677284, 107409.5, 376521.19999999995, 546118.5999999997, 677284.0, 0.05355824941648287, 7.913695801729503, 0.08907929385858265], "isController": false}, {"data": ["27 - PM - View Employee 631", 50, 0, 0.0, 3190.6, 693, 13820, 2412.5, 5835.799999999998, 12117.14999999999, 13820.0, 0.05589215050638288, 0.4616014812817188, 0.5292833822855418], "isController": true}, {"data": ["58 - Config - CDC Send Reminder", 50, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.027933023314018576, 0.0, 0.0], "isController": true}, {"data": ["24 - Request Feedback from PM - Load Projects", 50, 0, 0.0, 582.6800000000002, 137, 5892, 259.0, 1292.8999999999999, 1956.3999999999994, 5892.0, 0.055905899190482576, 0.059072444261818506, 0.13157540727447561], "isController": true}, {"data": ["GetEmployeeCdcInsight", 50, 1, 2.0, 4516.9, 287, 89239, 1348.0, 3733.7999999999984, 32916.59999999977, 89239.0, 0.09021671860142434, 0.7026085092860068, 0.22172168232528178], "isController": false}, {"data": ["33 - Project Manager - Feedback Requests (3)", 50, 0, 0.0, 4479.680000000001, 851, 51545, 2464.5, 7602.699999999998, 20466.99999999995, 51545.0, 0.04014194190658168, 0.34983075153743637, 0.38903186668058254], "isController": true}, {"data": ["26 - Project Manager - Feedback Requests", 50, 0, 0.0, 3098.2999999999993, 605, 13437, 2433.5, 5968.999999999999, 9174.59999999998, 13437.0, 0.055885778410653175, 0.48703582669596573, 0.5416117821751192], "isController": true}, {"data": ["53 - Config - Questionnaires", 50, 0, 0.0, 3377.879999999999, 670, 16883, 2370.0, 8531.199999999999, 12381.499999999989, 16883.0, 0.027867542227686736, 0.38674379159927363, 0.1380858488899243], "isController": true}, {"data": ["GetUnifiedCurrentAssessmentList", 400, 0, 0.0, 1681.1050000000012, 137, 103616, 838.5, 3031.6000000000004, 4556.049999999999, 16766.13000000006, 0.6489050538347856, 2.8174139349115785, 1.663373684750569], "isController": false}, {"data": ["61 - Config - Audit Logs", 50, 0, 0.0, 3677.04, 603, 31694, 2385.0, 6075.299999999999, 11354.549999999983, 31694.0, 0.028728565617193013, 0.2722761028465412, 0.1894850900180875], "isController": true}, {"data": ["03 - Save Assessment 5118", 50, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 2.2442659006239056, 0.0, 0.0], "isController": true}, {"data": ["59 - Config - Users & Peers", 50, 3, 6.0, 26549.82, 3677, 226061, 9228.0, 93954.19999999992, 172836.1999999999, 226061.0, 0.02784359694722803, 1.6497994651941117, 0.31119243858398604], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, 17.24137931034483, 0.145985401459854], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 48, 82.75862068965517, 0.7007299270072993], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6850, 58, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 48, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 10, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["ListPerformanceProjects", 50, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetEmployeeCdcReports", 150, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetAllAdviseeFeedback", 300, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["getUnifiedHistoryAssessmentList", 250, 2, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetPeersForUsers", 50, 2, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GetCdcOverviewPage", 50, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetStaffByProjectId", 200, 17, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["GetAllPerformanceAccessLevels", 50, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetFeedbackRequestByProjectManager", 1000, 3, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetPerformanceUsersByPositionIds", 50, 5, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetAllPerformancePositions", 50, 2, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetPerformanceAssessmentByIdWithExpectation", 500, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetAllQuestionnaires", 150, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GetEmployeeCdcInsightHistory", 50, 19, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GetEmployeeCdcInsight", 50, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

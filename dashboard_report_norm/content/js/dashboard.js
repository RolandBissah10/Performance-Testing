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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6186868686868687, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "05 - Open Assessment 5121"], "isController": true}, {"data": [0.0, 500, 1500, "ListPerformanceProjects"], "isController": false}, {"data": [0.0, 500, 1500, "GetPendingRecipientsOnReport"], "isController": false}, {"data": [0.5, 500, 1500, "46 - Project Manager - Feedback Requests (8)"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "GetEmployeeCdcReports"], "isController": false}, {"data": [1.0, 500, 1500, "56 - Config - CDC Cycle Overview"], "isController": true}, {"data": [1.0, 500, 1500, "44 - AI Enhance Text (assessment 5195)"], "isController": true}, {"data": [1.0, 500, 1500, "GetConsolidatedFeedbackByUserAndProject"], "isController": false}, {"data": [1.0, 500, 1500, "GetLiveAppraisalSessionReports"], "isController": false}, {"data": [1.0, 500, 1500, "07 - Change Assessor - Submit"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "ListProjectStaffByAccountManager"], "isController": false}, {"data": [0.0, 500, 1500, "42 - Project Manager - Feedback Requests (7)"], "isController": true}, {"data": [0.0, 500, 1500, "47 - Change Assessor 5194 - Load Project Staff"], "isController": true}, {"data": [0.0, 500, 1500, "GetAllPerformanceCycleTemplates"], "isController": false}, {"data": [1.0, 500, 1500, "12 - Save Assessment 5113"], "isController": true}, {"data": [0.9375, 500, 1500, "ListPerformanceUserProjects"], "isController": false}, {"data": [0.5, 500, 1500, "19 - My Projects - Self Consolidated Feedback"], "isController": true}, {"data": [0.9, 500, 1500, "GetAdviseesWithCdcData"], "isController": false}, {"data": [0.5, 500, 1500, "40 - PM - View Employee 631 (5)"], "isController": true}, {"data": [0.0, 500, 1500, "55 - Config - Performance Cycles"], "isController": true}, {"data": [1.0, 500, 1500, "GetPerformanceHistoryByUserId"], "isController": false}, {"data": [0.0, 500, 1500, "48 - Change Assessor 5194 - Submit"], "isController": true}, {"data": [0.5, 500, 1500, "GetProjectConfigurationPage"], "isController": false}, {"data": [0.0, 500, 1500, "29 - Request Feedback - Open Dialog"], "isController": true}, {"data": [0.5, 500, 1500, "50 - Config - Project Staff"], "isController": true}, {"data": [0.0, 500, 1500, "36 - PM - View Employee 538"], "isController": true}, {"data": [0.75, 500, 1500, "GetAllPerformanceDepartments"], "isController": false}, {"data": [1.0, 500, 1500, "GetProjectFeedbackConfig"], "isController": false}, {"data": [0.5, 500, 1500, "52 - Config - Create Competency"], "isController": true}, {"data": [0.0, 500, 1500, "60 - Config - Access Levels"], "isController": true}, {"data": [0.5, 500, 1500, "54 - Config - Questionnaires Pagination"], "isController": true}, {"data": [0.5, 500, 1500, "13 - My Feedback Tasks - List IN_PROGRESS"], "isController": true}, {"data": [1.0, 500, 1500, "18 - Legacy Assessments"], "isController": true}, {"data": [1.0, 500, 1500, "GetEmployeeCdcReportHistory"], "isController": false}, {"data": [0.75, 500, 1500, "GetAllAdviseeFeedback"], "isController": false}, {"data": [0.8, 500, 1500, "getUnifiedHistoryAssessmentList"], "isController": false}, {"data": [0.5, 500, 1500, "GetCdcConsolidatedOverview"], "isController": false}, {"data": [0.5, 500, 1500, "45 - Save Assessment 5195"], "isController": true}, {"data": [0.5, 500, 1500, "GetCandidateAssessmentResults"], "isController": false}, {"data": [0.0, 500, 1500, "15 - Open Assessment 5112"], "isController": true}, {"data": [1.0, 500, 1500, "GetLegacyAssessmentsByUserId"], "isController": false}, {"data": [0.5, 500, 1500, "39 - Project Manager - Feedback Requests (6)"], "isController": true}, {"data": [0.0, 500, 1500, "22 - Advisee - Consolidated CDC View"], "isController": true}, {"data": [0.0, 500, 1500, "34 - PM - View Employee 631 (3)"], "isController": true}, {"data": [0.5, 500, 1500, "31 - PM - Staff List"], "isController": true}, {"data": [1.0, 500, 1500, "41 - PM - Consolidated Feedback 631"], "isController": true}, {"data": [1.0, 500, 1500, "02 - AI Enhance Text (assessment 5118)"], "isController": true}, {"data": [0.0, 500, 1500, "35 - Project Manager - Feedback Requests (4)"], "isController": true}, {"data": [1.0, 500, 1500, "04 - My Feedback Tasks - List"], "isController": true}, {"data": [0.5, 500, 1500, "GetPeersForUsers"], "isController": false}, {"data": [0.0, 500, 1500, "16 - My Feedback Tasks - Back to List"], "isController": true}, {"data": [1.0, 500, 1500, "GetCdcOverviewPage"], "isController": false}, {"data": [1.0, 500, 1500, "51 - Config - Competencies"], "isController": true}, {"data": [0.5, 500, 1500, "getPastCDCReports"], "isController": false}, {"data": [0.5, 500, 1500, "21 - Advisees - CDC Reports"], "isController": true}, {"data": [0.5, 500, 1500, "GetAdviseeConsolidatedView"], "isController": false}, {"data": [0.0, 500, 1500, "GetStaffByProjectId"], "isController": false}, {"data": [0.0, 500, 1500, "GetAllPerformanceAccessLevels"], "isController": false}, {"data": [0.0, 500, 1500, "17 - CDC Insights"], "isController": true}, {"data": [0.5, 500, 1500, "14 - My Feedback Tasks - List All"], "isController": true}, {"data": [0.825, 500, 1500, "GetFeedbackRequestByProjectManager"], "isController": false}, {"data": [0.0, 500, 1500, "06 - Change Assessor - Load Project Staff"], "isController": true}, {"data": [0.0, 500, 1500, "32 - PM - View Employee 631 (2)"], "isController": true}, {"data": [1.0, 500, 1500, "GetPerformanceAuditActions"], "isController": false}, {"data": [0.0, 500, 1500, "37 - Project Manager - Feedback Requests (5)"], "isController": true}, {"data": [0.0, 500, 1500, "09 - My Feedback Tasks - Filter PENDING"], "isController": true}, {"data": [0.0, 500, 1500, "GetPerformanceUsersByPositionIds"], "isController": false}, {"data": [0.0, 500, 1500, "01 - Open Assessment 5118"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "GetProjectsByStaffId"], "isController": false}, {"data": [0.5, 500, 1500, "28 - Project Manager - Feedback Requests (back)"], "isController": true}, {"data": [1.0, 500, 1500, "25 - Request Feedback from PM - Submit"], "isController": true}, {"data": [1.0, 500, 1500, "GetAllPerformancePositions"], "isController": false}, {"data": [0.75, 500, 1500, "GetUserProjectData"], "isController": false}, {"data": [1.0, 500, 1500, "43 - Open Assessment 5195"], "isController": true}, {"data": [0.0, 500, 1500, "11 - Open Assessment 5113"], "isController": true}, {"data": [1.0, 500, 1500, "GetPerformanceAuditCategories"], "isController": false}, {"data": [0.45, 500, 1500, "GetPerformanceAssessmentByIdWithExpectation"], "isController": false}, {"data": [1.0, 500, 1500, "30 - Request Feedback - Submit"], "isController": true}, {"data": [0.0, 500, 1500, "57 - Config - CDC Pending Recipients"], "isController": true}, {"data": [0.5, 500, 1500, "49 - Config - Projects"], "isController": true}, {"data": [0.0, 500, 1500, "GetPerformanceAuditLogs"], "isController": false}, {"data": [1.0, 500, 1500, "GetMyAdvisees"], "isController": false}, {"data": [1.0, 500, 1500, "10 - My Feedback Tasks - Filter IN_PROGRESS"], "isController": true}, {"data": [0.5, 500, 1500, "38 - PM - View Employee 631 (4)"], "isController": true}, {"data": [0.5, 500, 1500, "GetSelfConsolidatedProjectFeedback"], "isController": false}, {"data": [0.0, 500, 1500, "08 - My Feedback Tasks - List (refresh)"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "GetAllCompetencies"], "isController": false}, {"data": [0.5, 500, 1500, "20 - Advisees - Overview"], "isController": true}, {"data": [0.0, 500, 1500, "23 - Advisees - Back to List"], "isController": true}, {"data": [1.0, 500, 1500, "GetPeersForUserByUserId"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "GetAllQuestionnaires"], "isController": false}, {"data": [0.0, 500, 1500, "GetEmployeeCdcInsightHistory"], "isController": false}, {"data": [0.0, 500, 1500, "27 - PM - View Employee 631"], "isController": true}, {"data": [1.0, 500, 1500, "58 - Config - CDC Send Reminder"], "isController": true}, {"data": [1.0, 500, 1500, "24 - Request Feedback from PM - Load Projects"], "isController": true}, {"data": [0.5, 500, 1500, "GetEmployeeCdcInsight"], "isController": false}, {"data": [0.0, 500, 1500, "33 - Project Manager - Feedback Requests (3)"], "isController": true}, {"data": [0.5, 500, 1500, "26 - Project Manager - Feedback Requests"], "isController": true}, {"data": [0.5, 500, 1500, "53 - Config - Questionnaires"], "isController": true}, {"data": [0.6875, 500, 1500, "GetUnifiedCurrentAssessmentList"], "isController": false}, {"data": [0.0, 500, 1500, "61 - Config - Audit Logs"], "isController": true}, {"data": [1.0, 500, 1500, "03 - Save Assessment 5118"], "isController": true}, {"data": [0.0, 500, 1500, "59 - Config - Users & Peers"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 137, 0, 0.0, 1389.591240875913, 144, 33294, 458.0, 2868.6, 5690.499999999982, 27708.000000000065, 0.4082179943683795, 4.24689238930439, 1.0758759134622546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["05 - Open Assessment 5121", 1, 0, 0.0, 1186.0, 1186, 1186, 1186.0, 1186.0, 1186.0, 1186.0, 0.8431703204047217, 6.098986878161889, 7.336569877740304], "isController": true}, {"data": ["ListPerformanceProjects", 1, 0, 0.0, 5375.0, 5375, 5375, 5375.0, 5375.0, 5375.0, 5375.0, 0.18604651162790697, 8.272165697674419, 0.40370639534883723], "isController": false}, {"data": ["GetPendingRecipientsOnReport", 1, 0, 0.0, 3239.0, 3239, 3239, 3239.0, 3239.0, 3239.0, 3239.0, 0.30873726458783574, 0.6792822823402285, 0.6765687712256869], "isController": false}, {"data": ["46 - Project Manager - Feedback Requests (8)", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 9.418177892918827, 12.457496761658032], "isController": true}, {"data": ["GetEmployeeCdcReports", 3, 0, 0.0, 622.6666666666666, 336, 1098, 434.0, 1098.0, 1098.0, 1098.0, 0.2752546105147261, 2.470033804706854, 0.7717343620974402], "isController": false}, {"data": ["56 - Config - CDC Cycle Overview", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 9.045918782552084, 7.319132486979166], "isController": true}, {"data": ["44 - AI Enhance Text (assessment 5195)", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": true}, {"data": ["GetConsolidatedFeedbackByUserAndProject", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 5.039294324925816, 8.044324925816023], "isController": false}, {"data": ["GetLiveAppraisalSessionReports", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 8.318429969879517, 14.954348644578312], "isController": false}, {"data": ["07 - Change Assessor - Submit", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": true}, {"data": ["ListProjectStaffByAccountManager", 15, 0, 0.0, 528.4666666666668, 284, 1072, 479.0, 947.8000000000001, 1072.0, 1072.0, 0.11731397913375358, 0.3826452053776728, 0.2908103560870313], "isController": false}, {"data": ["42 - Project Manager - Feedback Requests (7)", 1, 0, 0.0, 1768.0, 1768, 1768, 1768.0, 1768.0, 1768.0, 1768.0, 0.5656108597285069, 7.598186510180995, 8.399100325226245], "isController": true}, {"data": ["47 - Change Assessor 5194 - Load Project Staff", 1, 0, 0.0, 18594.0, 18594, 18594, 18594.0, 18594.0, 18594.0, 18594.0, 0.05378078950198989, 7.307254692373884, 0.18429374058836182], "isController": true}, {"data": ["GetAllPerformanceCycleTemplates", 1, 0, 0.0, 1706.0, 1706, 1706, 1706.0, 1706.0, 1706.0, 1706.0, 0.5861664712778428, 12.458899655627198, 1.562728971277843], "isController": false}, {"data": ["12 - Save Assessment 5113", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": true}, {"data": ["ListPerformanceUserProjects", 8, 0, 0.0, 255.37499999999997, 145, 819, 150.0, 819.0, 819.0, 819.0, 0.08411136344520145, 0.061769282530069816, 0.17282256707881236], "isController": false}, {"data": ["19 - My Projects - Self Consolidated Feedback", 1, 0, 0.0, 971.0, 971, 971, 971.0, 971.0, 971.0, 971.0, 1.0298661174047374, 2.241769116889804, 4.777210993820804], "isController": true}, {"data": ["GetAdviseesWithCdcData", 5, 0, 0.0, 243.0, 152, 600, 152.0, 600.0, 600.0, 600.0, 0.3449227373068433, 0.40690104166666663, 0.9009085480477372], "isController": false}, {"data": ["40 - PM - View Employee 631 (5)", 1, 0, 0.0, 1468.0, 1468, 1468, 1468.0, 1468.0, 1468.0, 1468.0, 0.6811989100817438, 5.625878107970028, 6.4507674131471395], "isController": true}, {"data": ["55 - Config - Performance Cycles", 1, 0, 0.0, 1872.0, 1872, 1872, 1872.0, 1872.0, 1872.0, 1872.0, 0.5341880341880343, 12.091742621527777, 2.750233707264957], "isController": true}, {"data": ["GetPerformanceHistoryByUserId", 2, 0, 0.0, 329.0, 323, 335, 329.0, 335.0, 335.0, 335.0, 2.466091245376079, 2.3685554099876693, 5.906336698520345], "isController": false}, {"data": ["48 - Change Assessor 5194 - Submit", 1, 0, 0.0, 3018.0, 3018, 3018, 3018.0, 3018.0, 3018.0, 3018.0, 0.3313452617627568, 1.5635354539430086, 1.7091461646785953], "isController": true}, {"data": ["GetProjectConfigurationPage", 1, 0, 0.0, 757.0, 757, 757, 757.0, 757.0, 757.0, 757.0, 1.321003963011889, 1.0991165785997359, 3.012250247688243], "isController": false}, {"data": ["29 - Request Feedback - Open Dialog", 1, 0, 0.0, 18474.0, 18474, 18474, 18474.0, 18474.0, 18474.0, 18474.0, 0.054130128829706615, 14.850791145664177, 0.6141443718198549], "isController": true}, {"data": ["50 - Config - Project Staff", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 5.518982656514383, 4.193765862944162], "isController": true}, {"data": ["36 - PM - View Employee 538", 1, 0, 0.0, 2104.0, 2104, 2104, 2104.0, 2104.0, 2104.0, 2104.0, 0.4752851711026616, 3.8598354325095054, 4.500820609553232], "isController": true}, {"data": ["GetAllPerformanceDepartments", 2, 0, 0.0, 483.0, 292, 674, 483.0, 674.0, 674.0, 674.0, 0.31525851197982346, 0.5787949243379571, 0.6766974700504413], "isController": false}, {"data": ["GetProjectFeedbackConfig", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 6.5359477124183005, 8.425245098039216, 14.81438929738562], "isController": false}, {"data": ["52 - Config - Create Competency", 1, 0, 0.0, 744.0, 744, 744, 744.0, 744.0, 744.0, 744.0, 1.3440860215053765, 5.029821908602151, 3.348401797715054], "isController": true}, {"data": ["60 - Config - Access Levels", 1, 0, 0.0, 16767.0, 16767, 16767, 16767.0, 16767.0, 16767.0, 16767.0, 0.059640961412297966, 10.781734582811476, 0.3098534323373293], "isController": true}, {"data": ["54 - Config - Questionnaires Pagination", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 6.251387655417408, 4.424886212255773], "isController": true}, {"data": ["13 - My Feedback Tasks - List IN_PROGRESS", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 8.925844869706841, 8.248294991856678], "isController": true}, {"data": ["18 - Legacy Assessments", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 5.627994337979095, 8.537265897212544], "isController": true}, {"data": ["GetEmployeeCdcReportHistory", 3, 0, 0.0, 169.0, 160, 181, 166.0, 181.0, 181.0, 181.0, 0.2817959797106895, 0.18630456861732106, 0.8239230109900432], "isController": false}, {"data": ["GetAllAdviseeFeedback", 6, 0, 0.0, 456.1666666666667, 149, 717, 499.5, 717.0, 717.0, 717.0, 0.08335880407902414, 0.1905421621884465, 0.20155898330045294], "isController": false}, {"data": ["getUnifiedHistoryAssessmentList", 5, 0, 0.0, 857.8, 153, 2903, 458.0, 2903.0, 2903.0, 2903.0, 0.06614719072880974, 0.31833335538239693, 0.1645798950574819], "isController": false}, {"data": ["GetCdcConsolidatedOverview", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 4.512039891629297, 4.011350896860987], "isController": false}, {"data": ["45 - Save Assessment 5195", 1, 0, 0.0, 1080.0, 1080, 1080, 1080.0, 1080.0, 1080.0, 1080.0, 0.9259259259259259, 5.3240740740740735, 4.271556712962963], "isController": true}, {"data": ["GetCandidateAssessmentResults", 1, 0, 0.0, 1473.0, 1473, 1473, 1473.0, 1473.0, 1473.0, 1473.0, 0.678886625933469, 0.6556824932111337, 1.6879349117447384], "isController": false}, {"data": ["15 - Open Assessment 5112", 1, 0, 0.0, 2436.0, 2436, 2436, 2436.0, 2436.0, 2436.0, 2436.0, 0.41050903119868637, 4.356446916050904, 3.5719096366995076], "isController": true}, {"data": ["GetLegacyAssessmentsByUserId", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 5.627994337979095, 8.537265897212544], "isController": false}, {"data": ["39 - Project Manager - Feedback Requests (6)", 1, 0, 0.0, 1397.0, 1397, 1397, 1397.0, 1397.0, 1397.0, 1397.0, 0.7158196134574087, 6.238256084466714, 6.937298675733715], "isController": true}, {"data": ["22 - Advisee - Consolidated CDC View", 1, 0, 0.0, 4718.0, 4718, 4718, 4718.0, 4718.0, 4718.0, 4718.0, 0.21195421788893598, 8.348388154408648, 4.599861898579907], "isController": true}, {"data": ["34 - PM - View Employee 631 (3)", 1, 0, 0.0, 1692.0, 1692, 1692, 1692.0, 1692.0, 1692.0, 1692.0, 0.5910165484633569, 4.881081006205674, 5.59676510786052], "isController": true}, {"data": ["31 - PM - Staff List", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 3.7707731213872835, 2.8653359826589595], "isController": true}, {"data": ["41 - PM - Consolidated Feedback 631", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 5.039294324925816, 8.044324925816023], "isController": true}, {"data": ["02 - AI Enhance Text (assessment 5118)", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": true}, {"data": ["35 - Project Manager - Feedback Requests (4)", 1, 0, 0.0, 2250.0, 2250, 2250, 2250.0, 2250.0, 2250.0, 2250.0, 0.4444444444444445, 3.873263888888889, 4.307291666666667], "isController": true}, {"data": ["04 - My Feedback Tasks - List", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 22.224638650963595, 10.807012847965739], "isController": true}, {"data": ["GetPeersForUsers", 1, 0, 0.0, 1110.0, 1110, 1110, 1110.0, 1110.0, 1110.0, 1110.0, 0.9009009009009009, 10.356841216216216, 2.2188203828828827], "isController": false}, {"data": ["16 - My Feedback Tasks - Back to List", 1, 0, 0.0, 1895.0, 1895, 1895, 1895.0, 1895.0, 1895.0, 1895.0, 0.5277044854881267, 8.414412928759894, 4.014470646437995], "isController": true}, {"data": ["GetCdcOverviewPage", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 9.045918782552084, 7.319132486979166], "isController": false}, {"data": ["51 - Config - Competencies", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 12.309827302631579, 8.194772820723685], "isController": true}, {"data": ["getPastCDCReports", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 3.399612312030075, 3.430451127819549], "isController": false}, {"data": ["21 - Advisees - CDC Reports", 1, 0, 0.0, 919.0, 919, 919, 919.0, 919.0, 919.0, 919.0, 1.088139281828074, 13.5783630304679, 12.141679134929271], "isController": true}, {"data": ["GetAdviseeConsolidatedView", 1, 0, 0.0, 1270.0, 1270, 1270, 1270.0, 1270.0, 1270.0, 1270.0, 0.7874015748031495, 17.84879429133858, 2.6790108267716537], "isController": false}, {"data": ["GetStaffByProjectId", 4, 0, 0.0, 17470.5, 8530, 33294, 14029.0, 33294.0, 33294.0, 33294.0, 0.016715769238805658, 2.27118984934913, 0.05728089283102447], "isController": false}, {"data": ["GetAllPerformanceAccessLevels", 1, 0, 0.0, 3940.0, 3940, 3940, 3940.0, 3940.0, 3940.0, 3940.0, 0.2538071065989848, 8.491880155456853, 0.6394749365482234], "isController": false}, {"data": ["17 - CDC Insights", 1, 0, 0.0, 19310.0, 19310, 19310, 19310.0, 19310.0, 19310.0, 19310.0, 0.05178663904712584, 12.788113752589332, 0.3869331790523045], "isController": true}, {"data": ["14 - My Feedback Tasks - List All", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 13.392137096774194, 6.512096774193548], "isController": true}, {"data": ["GetFeedbackRequestByProjectManager", 20, 0, 0.0, 504.65000000000003, 147, 2860, 303.5, 749.3000000000001, 2754.5999999999985, 2860.0, 0.16265319898179098, 0.3837598913476631, 0.4194991196395605], "isController": false}, {"data": ["06 - Change Assessor - Load Project Staff", 1, 0, 0.0, 33294.0, 33294, 33294, 33294.0, 33294.0, 33294.0, 33294.0, 0.030035441821349193, 4.080948331531207, 0.10292418491319759], "isController": true}, {"data": ["32 - PM - View Employee 631 (2)", 1, 0, 0.0, 5264.0, 5264, 5264, 5264.0, 5264.0, 5264.0, 5264.0, 0.1899696048632219, 1.5689188948518236, 1.7989602132408813], "isController": true}, {"data": ["GetPerformanceAuditActions", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 4.347059461805556, 13.699001736111112], "isController": false}, {"data": ["37 - Project Manager - Feedback Requests (5)", 1, 0, 0.0, 2550.0, 2550, 2550, 2550.0, 2550.0, 2550.0, 2550.0, 0.39215686274509803, 3.417585784313726, 3.8005514705882355], "isController": true}, {"data": ["09 - My Feedback Tasks - Filter PENDING", 1, 0, 0.0, 1555.0, 1555, 1555, 1555.0, 1555.0, 1555.0, 1555.0, 0.6430868167202572, 3.5796824758842445, 1.6497940112540193], "isController": true}, {"data": ["GetPerformanceUsersByPositionIds", 1, 0, 0.0, 12827.0, 12827, 12827, 12827.0, 12827.0, 12827.0, 12827.0, 0.07796055196070789, 11.485096744172449, 0.20860538317611288], "isController": false}, {"data": ["01 - Open Assessment 5118", 1, 0, 0.0, 5813.0, 5813, 5813, 5813.0, 5813.0, 5813.0, 5813.0, 0.1720282126268708, 1.8266237850507485, 1.496847045415448], "isController": true}, {"data": ["GetProjectsByStaffId", 9, 0, 0.0, 696.6666666666666, 156, 3226, 291.0, 3226.0, 3226.0, 3226.0, 0.0464020375650273, 0.07136025156349088, 0.10940931817361581], "isController": false}, {"data": ["28 - Project Manager - Feedback Requests (back)", 1, 0, 0.0, 1051.0, 1051, 1051, 1051.0, 1051.0, 1051.0, 1051.0, 0.9514747859181732, 8.29195409134158, 9.221128686964796], "isController": true}, {"data": ["25 - Request Feedback from PM - Submit", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": true}, {"data": ["GetAllPerformancePositions", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 24.73324201839827, 4.846878382034632], "isController": false}, {"data": ["GetUserProjectData", 6, 0, 0.0, 511.3333333333333, 147, 1041, 512.0, 1041.0, 1041.0, 1041.0, 0.08291759373142991, 0.07531951344646978, 0.1839734110916101], "isController": false}, {"data": ["43 - Open Assessment 5195", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 19.102990033222593, 15.326515780730897], "isController": true}, {"data": ["11 - Open Assessment 5113", 1, 0, 0.0, 1659.0, 1659, 1659, 1659.0, 1659.0, 1659.0, 1659.0, 0.6027727546714888, 6.361489413803496, 5.244829339963833], "isController": true}, {"data": ["GetPerformanceAuditCategories", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 4.47198275862069, 13.665140086206897], "isController": false}, {"data": ["GetPerformanceAssessmentByIdWithExpectation", 10, 0, 0.0, 1247.5, 173, 3802, 1046.5, 3622.9000000000005, 3802.0, 3802.0, 0.042674678126240234, 0.21558213862015696, 0.18790194212460154], "isController": false}, {"data": ["30 - Request Feedback - Submit", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": true}, {"data": ["57 - Config - CDC Pending Recipients", 1, 0, 0.0, 3239.0, 3239, 3239, 3239.0, 3239.0, 3239.0, 3239.0, 0.30873726458783574, 0.6792822823402285, 0.6765687712256869], "isController": true}, {"data": ["49 - Config - Projects", 1, 0, 0.0, 757.0, 757, 757, 757.0, 757.0, 757.0, 757.0, 1.321003963011889, 1.0991165785997359, 3.012250247688243], "isController": true}, {"data": ["GetPerformanceAuditLogs", 1, 0, 0.0, 3429.0, 3429, 3429, 3429.0, 3429.0, 3429.0, 3429.0, 0.2916302128900554, 2.392279090113736, 0.770370826042578], "isController": false}, {"data": ["GetMyAdvisees", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 10.400390625, 17.61474609375], "isController": false}, {"data": ["10 - My Feedback Tasks - Filter IN_PROGRESS", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 4.254578025477707, 16.36519705414013], "isController": true}, {"data": ["38 - PM - View Employee 631 (4)", 1, 0, 0.0, 1481.0, 1481, 1481, 1481.0, 1481.0, 1481.0, 1481.0, 0.675219446320054, 5.576494978055368, 6.394143526333558], "isController": true}, {"data": ["GetSelfConsolidatedProjectFeedback", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 1.0684742647058822, 3.3605238970588234], "isController": false}, {"data": ["08 - My Feedback Tasks - List (refresh)", 1, 0, 0.0, 3745.0, 3745, 3745, 3745.0, 3745.0, 3745.0, 3745.0, 0.26702269692923897, 2.771403538050734, 1.347630173564753], "isController": true}, {"data": ["GetAllCompetencies", 3, 0, 0.0, 557.0, 304, 744, 623.0, 744.0, 744.0, 744.0, 0.4185851820845542, 2.5289521417608483, 1.0389687543602624], "isController": false}, {"data": ["20 - Advisees - Overview", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 20.531669890065146, 7.899977096905538], "isController": true}, {"data": ["23 - Advisees - Back to List", 1, 0, 0.0, 2031.0, 2031, 2031, 2031.0, 2031.0, 2031.0, 2031.0, 0.4923682914820286, 5.90553452732644, 5.392009785819793], "isController": true}, {"data": ["GetPeersForUserByUserId", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 4.043625764525994, 6.806073203363914], "isController": false}, {"data": ["GetAllQuestionnaires", 3, 0, 0.0, 478.66666666666663, 300, 826, 310.0, 826.0, 826.0, 826.0, 0.6085192697768762, 2.0844558189655173, 1.5159498605476673], "isController": false}, {"data": ["GetEmployeeCdcInsightHistory", 1, 0, 0.0, 18073.0, 18073, 18073, 18073.0, 18073.0, 18073.0, 18073.0, 0.05533115697449233, 13.101650684031428, 0.14843231270403365], "isController": false}, {"data": ["27 - PM - View Employee 631", 1, 0, 0.0, 1858.0, 1858, 1858, 1858.0, 1858.0, 1858.0, 1858.0, 0.5382131324004306, 4.44498873116254, 5.096731196178687], "isController": true}, {"data": ["58 - Config - CDC Send Reminder", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": true}, {"data": ["24 - Request Feedback from PM - Load Projects", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 6.687598892405063, 14.895668512658228], "isController": true}, {"data": ["GetEmployeeCdcInsight", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 13.796506228146855, 4.3842875874125875], "isController": false}, {"data": ["33 - Project Manager - Feedback Requests (3)", 1, 0, 0.0, 1692.0, 1692, 1692, 1692.0, 1692.0, 1692.0, 1692.0, 0.5910165484633569, 5.150616873522459, 5.727781471631205], "isController": true}, {"data": ["26 - Project Manager - Feedback Requests", 1, 0, 0.0, 1436.0, 1436, 1436, 1436.0, 1436.0, 1436.0, 1436.0, 0.6963788300835655, 6.068832694986073, 6.748890146239555], "isController": true}, {"data": ["53 - Config - Questionnaires", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 14.874522709003214, 5.310909030010718], "isController": true}, {"data": ["GetUnifiedCurrentAssessmentList", 8, 0, 0.0, 614.875, 156, 1555, 547.0, 1555.0, 1555.0, 1555.0, 0.10428888019814886, 0.4528011341415722, 0.26732936954112896], "isController": false}, {"data": ["61 - Config - Audit Logs", 1, 0, 0.0, 3718.0, 3718, 3718, 3718.0, 3718.0, 3718.0, 3718.0, 0.26896180742334586, 2.549096036175363, 1.7739922337278107], "isController": true}, {"data": ["03 - Save Assessment 5118", 1, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, NaN, NaN], "isController": true}, {"data": ["59 - Config - Users & Peers", 1, 0, 0.0, 8076.0, 8076, 8076, 8076.0, 8076.0, 8076.0, 8076.0, 0.12382367508667656, 7.464729600049529, 1.4014808537642396], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 137, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

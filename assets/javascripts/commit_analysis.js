var redmine_commit_analysis = {};
redmine_commit_analysis.trackers;
redmine_commit_analysis.changeLists;
redmine_commit_analysis.orignChangeLists;
redmine_commit_analysis.chartData = [];

$(document).ready(function () {
  
  
  $('#scm_search').on("ajax:success", function(event, xhr, status) {
  	$('#commit_analysis_search_result').empty();
  	$('#commit_analysis_search_result').append(xhr);
  	redmine_commit_analysis.trackers = $('#charttop').data('tracker-id');
  	redmine_commit_analysis.changeLists = $('#charttop').data('changelist-id');
  	redmine_commit_analysis.orignChangeLists = $('#charttop').data('changelist-id');
  	drawGrid();
  	redmine_commit_analysis.chartData = makeChartData( redmine_commit_analysis.trackers , redmine_commit_analysis.changeLists );
  	drawChart();
  });
  
  var background = [
    "rgba(234,85,50,0.8)",
    "rgba(246,173,60,0.8)",
    "rgba(255,243,63,0.8)", 
    "rgba(170,207,82,0.8)",
    "rgba(0,169,95,0.8)",
    "rgba(0,173,169,0.8)",
    "rgba(0,175,236,0.8)",
    "rgba(24,127,196,0.8)",
    "rgba(77,67,152,0.8)",
    "rgba(166,74,151,0.8)",
    "rgba(232,82,152,0.8)",
    "rgba(233,84,107,0.8)"
  ];

  function drawGrid()
  {
    let labelPath = $("#label_path").text();
    let labelTotal = $("#label_total").text();
    
    if ( w2ui['ticketgrid'] )
    {
      w2ui['ticketgrid'].destroy();
    }
    
    let col = [];
    col.push({ field: 'path', caption: labelPath, size: '250px', sortable: true });
    for( let i=0 ; i<redmine_commit_analysis.trackers.length ; i++)
    {
      col.push({ field: 'tracker' + i, caption: redmine_commit_analysis.trackers[i].name, style: 'text-align: center', sortable: true });
    }
    col.push({ field: 'allCount' , caption: labelTotal, style: 'text-align: center', sortable: true });
    
    let rec = [];
    let row = {};
    for( let i=0 ; i<redmine_commit_analysis.changeLists.length ; i++)
    {
      row = {};
      row["recid"] = i + 1;
      row["path"] = redmine_commit_analysis.changeLists[i].path;
      for( let j=0 ; j<redmine_commit_analysis.trackers.length ; j++)
      {
        row['tracker' + j] = redmine_commit_analysis.changeLists[i].trackers_count[redmine_commit_analysis.trackers[j].id];
      }
      row["allCount"] = redmine_commit_analysis.changeLists[i].issue_count;
      rec.push(row);
    }
    
    $('#gridtop').w2grid({ 
      name: 'ticketgrid', 
      show: {
        lineNumbers    : true,
        expandColumn: true
      }, 
      reorderColumns: true,       
      columns: col,
      records: rec,
      onExpand: function (event) {
        $('#'+event.box_id).html(makeTicketLinkHtml(event));
      },
      onSort: function (event) {
        event.done(function () {
          let newChangeList = [];

          for( let i=0 ; i<w2ui['ticketgrid'].records.length ; i++ )
          {
            let pos = w2ui['ticketgrid'].records[i].recid - 1;
            newChangeList.push(redmine_commit_analysis.orignChangeLists[pos]);
          }
          redmine_commit_analysis.changeLists = [];
          redmine_commit_analysis.changeLists = newChangeList;
          redmine_commit_analysis.chartData = makeChartData( redmine_commit_analysis.trackers , redmine_commit_analysis.changeLists );
          drawChart();
        });
      }
    });
  }
  
  function makeTicketLinkHtml( event )
  {
    let ticketArray = redmine_commit_analysis.orignChangeLists[event.recid - 1].tickets.split(",");
    let ret = "";
    for( let i=0 ; i<ticketArray.length ; i++ )
    {
      ret = ret + "<div style='padding: 2px'><a href='/issues/" + ticketArray[i] + "'>#" + ticketArray[i] + "</a></div>";
    }
    return "<div style='padding: 0px 0px 0px 8px; height: 92px; overflow:auto'>" + ret + "</div>";
  }
  
  function makeChartData()
  {

    let chartdata = [];
    let trackerCount = 0;
    let changelistCount = 0;
    
    redmine_commit_analysis.charaData = [];
    
    if ( redmine_commit_analysis.trackers !== null && redmine_commit_analysis.trackers !== undefined )
    {
      trackerCount = redmine_commit_analysis.trackers.length;
    }
    if ( redmine_commit_analysis.changeLists !== null && redmine_commit_analysis.changeLists !== undefined )
    {
      changelistCount = redmine_commit_analysis.changeLists.length;
    }

    let srcname = [];
    for( let i=0 ; i<changelistCount ; i++)
    {
       srcname.push(redmine_commit_analysis.changeLists[i].path);
    }
    
    let values = [];
    for( let i=0 ; i<trackerCount ; i++)
    {
      values = [];
      for( let j=0 ; j<changelistCount ; j++)
      {
        values.push(redmine_commit_analysis.changeLists[j].trackers_count[redmine_commit_analysis.trackers[i].id]);
      }
      chartdata.push({
        "label": redmine_commit_analysis.trackers[i].name, 
        "data" : values, 
        "backgroundColor" : background[i%12]}
      ); 
      
    }
    
    return { "data" : chartdata , "srcname" : srcname };
  }
  
  function drawChart()
  {
    if ( $("#commitchart") )
    {
      $("#commitchart").remove();
      $("#charttop").append('<canvas id="commitchart"></canvas>');
    }
    
    let ctx = $("#commitchart");
    
    let chart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: redmine_commit_analysis.chartData.srcname,
          datasets: redmine_commit_analysis.chartData.data
      },
      options: {
        scales: {
            xAxes: [{
              ticks: {
                beginAtZero:true
              },
              stacked: true
            }],
            yAxes:[{
              stacked: true
            }]            
        },
        tooltips: {
            position: 'nearest'
          },
          responsive: true
      }
    });  
  }
  
});

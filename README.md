# redmine_commit_analysis
A plugin for redmine that displays the association between commits and tickets.  
![commit_analysis](https://user-images.githubusercontent.com/28261510/55772384-f4499c00-5ac6-11e9-8792-73b5562ab0fd.png)
# Overview
Counts and displays the number of commits associated with the ticket.
The results show the following:
- Files with many defect tickets may have degraded.
- Files with many feature tickets may be more complex.
# Installing
From your Redmine plugins directory, clone this repository as `redmine_commit_analysis`  
```git clone https://github.com/h-enomoto/redmine_commit_analysis.git redmine_commit_analysis```
# Usage
## Search option
Specify the conditions of the ticket to be displayed.
In addition to the filter condition of issue, you can specify the following:
- Commit Date
- Revision(SVN Only)
- Ignore File
## Display option
- Number of display
Specifies the number of items to display.
- Display order
Select whether to display tickets in descending order of the total number of tickets or in descending order of the total number of tickets.
- Display only file name
Displays only the file name, excluding the path name.
## Ticket count list
- Lists the total number of tickets in ascending or descending order.
- You can sort by clicking the column header.
- You can move a column by dragging the column header.
- Click the plus sign (+) to display the tickets associated with the file. Click on the displayed ticket information to jump to that ticket.
![expand](https://user-images.githubusercontent.com/28261510/55775465-5d83dc00-5ad4-11e9-9c5d-a31f8c80528b.png)
## Ticket count graph
- Display the number of each ticket as a stacked graph by tracker ID.
- The color of stacked graph is 12 colors fixed. If the tracker has 12 or more colors, it will be used repeatedly.
# Test environment
Environment of this plugin of test follows:
- Redmine 4.0.1
- Database is postgresql and mySQL
# License
redmine_commit_analysis is released under GPL3.

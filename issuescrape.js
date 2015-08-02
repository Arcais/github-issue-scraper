var request = require('request'),
    cheerio = require('cheerio'),
    fs      = require('fs');

var issueScrape = JSON.parse(fs.readFileSync(__dirname+'/config.json', 'utf8'));

function requestIssue(issueNumber,issueRepository){
  request('https://github.com/'+issueRepository+'/issues/'+issueNumber,function(err,resp,body){

    if(!err && resp.statusCode==200){
      var $ = cheerio.load(body);
      console.log("Get request complete on: issues/"+issueNumber);

      var linkForFile = __dirname+"/issues/"+issueRepository.replace("/","-")+"-issue-"+issueNumber+".html";
      fs.writeFile(linkForFile, $('.comment-body').html(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Issue number "+issueNumber+" was saved!");
      });
    }
    else{
      console.log(resp.statusCode);
      console.log("Error:");
      console.log(err);
    }

  });
}

if(issueScrape.getIssuesFromLink){
  for(var i=1;i<=issueScrape.numberOfIssues;i++){
    requestIssue(i,issueScrape.issueRepository);
  }
}

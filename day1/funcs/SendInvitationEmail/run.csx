#r "SendGrid"
#r "Newtonsoft.Json"

using System;
using SendGrid.Helpers.Mail;
using System.Text;
using Newtonsoft.Json;

public static void Run(EmailDetails myQueueItem,
    ILogger log,
    out SendGridMessage email)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
    var emailFrom = "alexander.novicov@gmail.com";

    var sb = new StringBuilder();
    sb.Append($"Hi {myQueueItem.Name},");
    sb.Append($"<p>You're invited to join us on {myQueueItem.EventDateAndTime} at {myQueueItem.Location}.</p>");
    sb.Append($"<p>Let us know if you can make it by clicking <a href=\"{myQueueItem.ResponseUrl}\">here</a></p>");
    log.LogInformation(sb.ToString());

    email = new SendGridMessage();
    email.AddTo(myQueueItem.Email);
    email.AddContent("text/html", sb.ToString());
    email.SetFrom(new EmailAddress(emailFrom));
    email.SetSubject("Your invitation...");
}


public class EmailDetails
{
    public DateTime EventDateAndTime {get; set;}
    public string Location {get; set;}
    public string Name { get; set; }
    public string Email { get; set; }
    public string ResponseUrl { get; set; }
}

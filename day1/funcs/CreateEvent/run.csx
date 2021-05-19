#r "Newtonsoft.Json"

using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

public static async Task<IActionResult> Run(HttpRequest req,
    IAsyncCollector<EmailDetails> emailsQueue,
    ILogger log)
{
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    var eventDetails = JsonConvert.DeserializeObject<EventDetails>(requestBody);

    foreach(var invitee in eventDetails.Invitees)
    {
        log.LogInformation($"Inviting {invitee.Name} ({invitee.Email})");
        var accessCode = Guid.NewGuid().ToString("n");
        var emailDetails = new EmailDetails {
            EventDateAndTime = eventDetails.EventDateAndTime,
            Location = eventDetails.Location,
            Name = invitee.Name,
            Email = invitee.Email,
            ResponseUrl = $"https://function.url/index.html?code={accessCode}"
        };
        await emailsQueue.AddAsync(emailDetails);
    }

    return new OkResult();
}

public class EventDetails
{
    public DateTime EventDateAndTime {get; set;}
    public string Location {get; set;}
    public List<InviteeDetails> Invitees { get; set; }
}

public class InviteeDetails
{
    public string Name { get; set; }
    public string Email { get; set; }
}

public class EmailDetails
{
    public DateTime EventDateAndTime {get; set;}
    public string Location {get; set;}
    public string Name { get; set; }
    public string Email { get; set; }
    public string ResponseUrl { get; set; }
}

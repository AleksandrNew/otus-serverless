using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


public static IActionResult Run(HttpRequest req,
    ILogger log)
{
    string responseCode = req.Query["responseCode"];

    if (responseCode == "hello_world")
    {
        return new OkObjectResult(new {
            EventDateAndTime = DateTime.UtcNow,
            Location = "Best pub",
            Responses = new[] {
                new { Name = "Mark", Joining = "yes" },
                new { Name = "Jon", Joining = "no" },
            }
        });
    }
    return new NotFoundObjectResult("Invalid response code");
}

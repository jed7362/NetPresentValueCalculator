using Microsoft.AspNetCore.Mvc;

using Web.Api.Models;

namespace Web.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class NetPresentValueCalculatorController : ControllerBase
{
    private readonly ILogger<NetPresentValueCalculatorController> _logger;

    public NetPresentValueCalculatorController(ILogger<NetPresentValueCalculatorController> logger)
    {
        _logger = logger;
    }

    [HttpPost(Name = "Calculate")]
    public async Task<IActionResult> Calculate([FromBody] CalculateNPVInput input)
    {
        var results = new List<CalculateNPVOutput>();

        await Task.Run(() =>
        {
            foreach (var cashFlow in input.CashFlows)
            {
                for (var discountRate = input.LowerRate; discountRate <= input.UpperRate; discountRate += input.RateIncrement)
                {
                    var npv = CalculateNPV(cashFlow, discountRate);
                    CalculateNPVOutput result = new() { CashFlow = cashFlow, DiscountRate = discountRate, Npv = npv };

                    results.Add(result);
                }
            }
        });

        return Ok(new { results });
    }

    /// <summary>
    /// Calculate the Net Present Value based on Cash Flow and Discount Rate
    /// </summary>
    /// <param name="cashFlow"></param>
    /// <param name="discountRate"></param>
    /// <returns></returns>
    private double CalculateNPV(double cashFlow, double discountRate)
    {
        return cashFlow - (cashFlow * (discountRate / 100));
    }
}
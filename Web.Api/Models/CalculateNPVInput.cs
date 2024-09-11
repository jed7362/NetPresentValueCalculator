namespace Web.Api.Models;

public class CalculateNPVInput
{
    public List<double> CashFlows { get; set; }
    public double LowerRate { get; set; }
    public double UpperRate { get; set; }
    public double RateIncrement { get; set; }
}
namespace Web.Api.Models;

public class CalculateNPVOutput
{
    public double CashFlow { get; set; }
    public double DiscountRate { get; set; }
    public double Npv { get; set; }
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Api.Controllers;
using Web.Api.Models;
using Xunit;

namespace Web.Api.Tests
{
    public class NetPresentValueCalculatorControllerTests
    {
        private readonly NetPresentValueCalculatorController _controller;
        private readonly Mock<ILogger<NetPresentValueCalculatorController>> _loggerMock;

        public NetPresentValueCalculatorControllerTests()
        {
            _loggerMock = new Mock<ILogger<NetPresentValueCalculatorController>>();
            _controller = new NetPresentValueCalculatorController(_loggerMock.Object);
        }

        [Fact]
        public async Task Calculate_ReturnsOkResult_WithValidInput()
        {
            // Arrange
            var input = new CalculateNPVInput
            {
                CashFlows = new List<double> { 1000, 2000 },
                LowerRate = 5,
                UpperRate = 10,
                RateIncrement = 1
            };

            // Act
            var result = await _controller.Calculate(input);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Dictionary<string, List<CalculateNPVOutput>>>(
                okResult.Value
            );
            Assert.NotEmpty(returnValue["results"]);

            foreach (var output in returnValue["results"])
            {
                Assert.Equal(output.CashFlow - (output.CashFlow * (output.DiscountRate / 100)), output.Npv);
            }
        }

        [Fact]
        public async Task Calculate_ReturnsOkResult_WithEmptyCashFlows()
        {
            // Arrange
            var input = new CalculateNPVInput
            {
                CashFlows = new List<double>(), // Empty list
                LowerRate = 5,
                UpperRate = 10,
                RateIncrement = 1
            };

            // Act
            var result = await _controller.Calculate(input);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<Dictionary<string, List<CalculateNPVOutput>>>(
                okResult.Value
            );
            Assert.Empty(returnValue["results"]);
        }
    }
}

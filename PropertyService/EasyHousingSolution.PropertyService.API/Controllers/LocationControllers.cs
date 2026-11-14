using EasyHousingSolution.PropertyService.Application.DTOs;
using EasyHousingSolution.PropertyService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.PropertyService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class StatesController : ControllerBase
{
    private readonly ILocationAppService _locationService;

    public StatesController(ILocationAppService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllStates()
    {
        var states = await _locationService.GetAllStatesAsync();
        return Ok(states);
    }

    [HttpPost]
    public async Task<IActionResult> CreateState(StateDto dto)
    {
        var created = await _locationService.CreateStateAsync(dto);
        return CreatedAtAction(nameof(GetAllStates), created);
    }
}

[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class CitiesController : ControllerBase
{
    private readonly ILocationAppService _locationService;

    public CitiesController(ILocationAppService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCities()
    {
        var cities = await _locationService.GetAllCitiesAsync();
        return Ok(cities);
    }

    [HttpGet("by-state/{stateId:int}")]
    public async Task<IActionResult> GetCitiesByState(int stateId)
    {
        var cities = await _locationService.GetCitiesByStateIdAsync(stateId);
        return Ok(cities);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCity(CityDto dto)
    {
        var created = await _locationService.CreateCityAsync(dto);
        return CreatedAtAction(nameof(GetAllCities), created);
    }
}

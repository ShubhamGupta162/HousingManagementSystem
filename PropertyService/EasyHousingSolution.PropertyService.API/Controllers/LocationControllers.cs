using EasyHousingSolution.PropertyService.Application.DTOs;
using EasyHousingSolution.PropertyService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.PropertyService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatesController : ControllerBase
{
    private readonly ILocationAppService _locationService;

    public StatesController(ILocationAppService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<StateDto>>>> GetAllStates()
    {
        var states = await _locationService.GetAllStatesAsync();
        return Ok(ApiResponse<IEnumerable<StateDto>>.Ok(states));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<StateDto>>> CreateState([FromBody] StateDto dto)
    {
        var created = await _locationService.CreateStateAsync(dto);
        return CreatedAtAction(nameof(GetAllStates), ApiResponse<StateDto>.Ok(created, "State created successfully."));
    }
}

[ApiController]
[Route("api/[controller]")]
public class CitiesController : ControllerBase
{
    private readonly ILocationAppService _locationService;

    public CitiesController(ILocationAppService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CityDto>>>> GetAllCities()
    {
        var cities = await _locationService.GetAllCitiesAsync();
        return Ok(ApiResponse<IEnumerable<CityDto>>.Ok(cities));
    }

    [HttpGet("by-state/{stateId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CityDto>>>> GetCitiesByState(int stateId)
    {
        var cities = await _locationService.GetCitiesByStateIdAsync(stateId);
        return Ok(ApiResponse<IEnumerable<CityDto>>.Ok(cities));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CityDto>>> CreateCity([FromBody] CityDto dto)
    {
        var created = await _locationService.CreateCityAsync(dto);
        return CreatedAtAction(nameof(GetAllCities), ApiResponse<CityDto>.Ok(created, "City created successfully."));
    }
}

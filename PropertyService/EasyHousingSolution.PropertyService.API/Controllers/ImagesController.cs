using EasyHousingSolution.PropertyService.Application.DTOs;
using EasyHousingSolution.PropertyService.Application.Interfaces;
using EasyHousingSolution.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EasyHousingSolution.PropertyService.API.Controllers;

[ApiController]
[Route("api/properties/{propertyId:int}/[controller]")]
public class ImagesController : ControllerBase
{
    private readonly IImageAppService _imageService;

    public ImagesController(IImageAppService imageService)
    {
        _imageService = imageService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<IEnumerable<PropertyImageDto>>>> GetImages(int propertyId)
    {
        var images = await _imageService.GetImagesByPropertyIdAsync(propertyId);
        return Ok(ApiResponse<IEnumerable<PropertyImageDto>>.Ok(images));
    }

    // Only Seller can upload images for a property
    [HttpPost]
    [Authorize(Roles = "Seller")]
    public async Task<ActionResult<ApiResponse<IEnumerable<PropertyImageDto>>>> UploadImages(int propertyId, [FromBody] UploadImagesDto dto)
    {
        var uploaded = await _imageService.UploadImagesAsync(propertyId, dto.Images);
        return Ok(ApiResponse<IEnumerable<PropertyImageDto>>.Ok(uploaded, "Images uploaded successfully."));
    }
}

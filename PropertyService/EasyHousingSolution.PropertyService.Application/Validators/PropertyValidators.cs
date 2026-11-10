using EasyHousingSolution.PropertyService.Application.DTOs;
using FluentValidation;

namespace EasyHousingSolution.PropertyService.Application.Validators;

public class CreatePropertyDtoValidator : AbstractValidator<CreatePropertyDto>
{
    public CreatePropertyDtoValidator()
    {
        RuleFor(x => x.PropertyName).NotEmpty().MaximumLength(50);
        RuleFor(x => x.PropertyType).NotEmpty();
        RuleFor(x => x.PropertyOption).NotEmpty();
        RuleFor(x => x.PriceRange).GreaterThan(0);
    }
}

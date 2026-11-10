using EasyHousingSolution.CartService.Application.DTOs;
using FluentValidation;

namespace EasyHousingSolution.CartService.Application.Validators;

public class AddToCartDtoValidator : AbstractValidator<AddToCartDto>
{
    public AddToCartDtoValidator()
    {
        RuleFor(x => x.BuyerId).GreaterThan(0);
        RuleFor(x => x.PropertyId).GreaterThan(0);
    }
}

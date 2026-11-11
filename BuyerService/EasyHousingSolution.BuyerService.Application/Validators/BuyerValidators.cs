using FluentValidation;
using EasyHousingSolution.BuyerService.Application.DTOs;

namespace EasyHousingSolution.BuyerService.Application.Validators;

public class CreateBuyerDtoValidator : AbstractValidator<CreateBuyerDto>
{
    public CreateBuyerDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MaximumLength(50).WithMessage("Full name cannot exceed 50 characters.");

        RuleFor(x => x.EmailId)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.")
            .MaximumLength(50).WithMessage("Email cannot exceed 50 characters.");

        RuleFor(x => x.PhoneNo)
            .NotEmpty().WithMessage("Phone number is required.")
            .Matches(@"^[0-9]{10}$").WithMessage("Phone number must be exactly 10 digits.");
    }
}

public class AddToCartDtoValidator : AbstractValidator<AddToCartDto>
{
    public AddToCartDtoValidator()
    {
        RuleFor(x => x.BuyerId)
            .GreaterThan(0).WithMessage("Buyer ID is required.");

        RuleFor(x => x.PropertyId)
            .GreaterThan(0).WithMessage("Property ID is required.");
    }
}

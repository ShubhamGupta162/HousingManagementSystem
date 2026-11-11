using FluentValidation;
using EasyHousingSolution.SellerService.Application.DTOs;

namespace EasyHousingSolution.SellerService.Application.Validators;

public class CreateSellerDtoValidator : AbstractValidator<CreateSellerDto>
{
    public CreateSellerDtoValidator()
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

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required.")
            .MaximumLength(250).WithMessage("Address cannot exceed 250 characters.");

        RuleFor(x => x.StateId)
            .GreaterThan(0).WithMessage("State is required.");

        RuleFor(x => x.CityId)
            .GreaterThan(0).WithMessage("City is required.");
    }
}

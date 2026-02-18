# Contributing to LicenseGuard

Thank you for your interest in contributing to LicenseGuard! This document provides guidelines for contributing to this demo project.

## Project Status

**LicenseGuard is currently a demonstration/prototype application.** It showcases core functionality using mock authentication and browser localStorage.

## How to Contribute

### Reporting Issues

If you find bugs or have feature suggestions:

1. **Check existing issues** to avoid duplicates
2. **Open a new issue** with a clear title and description
3. **Include:**
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Enhancements

We welcome ideas for improving LicenseGuard:

- New license types or certifications
- UI/UX improvements
- Performance optimizations
- Additional features for insurance professionals

Open an issue with the `enhancement` label and describe your suggestion.

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes** (`npm run dev` and manual testing)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to your branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with a clear description

### Code Style

- **TypeScript** - Use types, avoid `any` when possible
- **Components** - Keep them small and focused
- **Naming** - Use descriptive names for variables and functions
- **Comments** - Explain why, not what (code should be self-documenting)

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/licenseguard.git
cd licenseguard

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Development Priorities

### Current Focus (Prototype)
- Core license tracking features
- Dashboard and calendar views
- Team management
- NIPR/Sircon integration

### Future Production Features
- Real authentication (Auth0, Clerk, etc.)
- Backend API with proper database
- Email notifications
- File upload to cloud storage
- Mobile app
- Stripe billing integration

## Questions?

Open an issue with the `question` label or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make LicenseGuard better for insurance professionals!** 🛡️

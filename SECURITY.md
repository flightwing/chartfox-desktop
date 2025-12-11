# Security Policy

## Supported Versions

Use this section to understand which versions of ChartFox Desktop are currently being supported with security updates. Generally, we recommend always running the latest version.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

We take the security of ChartFox Desktop seriously. If you believe you have found a security vulnerability in this project, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

To ensure the safety of our users, we ask that you disclose vulnerabilities privately:

1.  Navigate to the **Security** tab of the repository on GitHub.
2.  Click firmly on **"Report a vulnerability"** to open a private security advisory draft.
3.  Fill in the details of the vulnerability.

If the "Report a vulnerability" button is not available, please contact the maintainer directly or open a generic issue asking for a private communication channel (without disclosing the vulnerability details).

### What to Expect

*   **Triage:** We will acknowledge your report and evaluate the impact of the vulnerability.
*   **Fix:** If confirmed, we will work on a patch to address the issue.
*   **Release:** A new version of the application will be released with the fix.
*   **Disclosure:** Once the fix is available to users, we will publish a security advisory detailing the vulnerability and giving credit to the reporter (if desired).

### Scope

Please note that this application is a **desktop wrapper** for ChartFox.
*   **In Scope:** Vulnerabilities related to the Electron wrapper, the application's build process, or local handling of data.
*   **Out of Scope:** Vulnerabilities related to the [ChartFox.org](https://chartfox.org/) web service itself (e.g., website XSS, data leaks on the server side). These should be reported to the ChartFox team directly.

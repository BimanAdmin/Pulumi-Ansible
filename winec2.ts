import * as varconfig from "./Config";
import * as pulumi from "@pulumi/pulumi";
import * as aws from '@pulumi/aws';
import { pubsub1id } from "./vpc";
import { SecGrup } from "./securityGroup";

// Configure the user data to install IIS and a default application
// const userData = pulumi.interpolate`<powershell>
//     # Install IIS
//     Install-WindowsFeature -name Web-Server -IncludeManagementTools -Force

//     # Create a default HTML file for the IIS default site
//     @"
//     <html>
//         <head>
//             <title>Welcome to Pulumi IIS</title>
//         </head>
//         <body>
//             <h1>Hello from Pulumi and IIS!</h1>
//             <p>This is a default application deployed using Pulumi.</p>
//         </body>
//     </html>
// "@" | Out-File -FilePath C:\\inetpub\\wwwroot\\index.html -Encoding UTF8

//     # Restart IIS
//     Restart-Service W3SVC
// </powershell>
// `;




const instance = new aws.ec2.Instance(varconfig.amzec2keyval.name, {
    ami: varconfig.amzec2keyval.amiid,  // Amazon Linux 2 AMI
    instanceType: varconfig.amzec2keyval.instancetype,  // Choose an appropriate instance type
    subnetId: pubsub1id,
    securityGroups: [SecGrup],
    keyName: varconfig.amzec2keyval.keypairname,  // Replace with your SSH key name
    associatePublicIpAddress: true,
   
    // privateIp:varconfig.amzec2keyval.privateip,
    tags: {
        Name: varconfig.amzec2keyval.name,
    },

    userData: pulumi.interpolate `#cloud-config
        runcmd:
          - powershell.exe Add-WindowsFeature Web-Server

//     # Install IIS
//     Install-WindowsFeature -name Web-Server -IncludeManagementTools -Force

//     # Restart IIS
//     Restart-Service W3SVC
// </powershell>`,
    
});

export const publicIp = instance.publicIp;
export const privateIp = instance.privateIp;
export const publicHostName = instance.publicDns;
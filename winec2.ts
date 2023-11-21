import * as varconfig from "./Config";
import * as pulumi from "@pulumi/pulumi";
import * as aws from '@pulumi/aws';
import { pubsub1id } from "./vpc";
import { SecGrup } from "./securityGroup";

// Script to create a folder
const createFolderScript = `
New-Item -Path C:\\Ansible -ItemType Directory
`;

// Local path to the script.ps1 file
const localScriptPath = "./script.ps1";

// Copy the script.ps1 file to the Windows EC2 instance
const copyFileScript = `
Copy-Item -Path ${localScriptPath} -Destination C:\\Ansible -Force
`;

// Local path to the script.ps1 file
//const localScriptPath = pulumi.interpolate`${pulumi.getStack() === "dev" ? "." : ".."}/script.ps1`;

// Copy the script.ps1 file to the Windows EC2 instance
//const copyScriptCommand = `Copy-Item -Path "${localScriptPath}" -Destination "C:\\Ansible\\script.ps1"`;

// Run the PowerShell script to create the folder and copy the script file
const userData = pulumi.interpolate`<powershell>${createFolderScript}\n${copyFileScript}</powershell>`;


// Run the PowerShell script to create the folder and copy the script file
//const runScriptUserData = pulumi.interpolate`<powershell>${createFolderScript}${copyScriptCommand}</powershell>`;

const instance = new aws.ec2.Instance(varconfig.amzec2keyval.name, {
    ami: varconfig.amzec2keyval.amiid,  // Windows 2019 AMI
    instanceType: varconfig.amzec2keyval.instancetype,  // Choose an appropriate instance type
    subnetId: pubsub1id,
    securityGroups: [SecGrup],
    keyName: varconfig.amzec2keyval.keypairname,  // Replace with your SSH key name
    associatePublicIpAddress: true,
    //userData: runScriptUserData,
    userData: userData,

    tags: {
        Name: "WindowsInstanceWithScript",
    },
});

export const publicIp = instance.publicIp;
export const privateIp = instance.privateIp;
export const publicHostName = instance.publicDns;


export const instanceId = instance.id;
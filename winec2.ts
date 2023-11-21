import * as varconfig from "./Config";
import * as pulumi from "@pulumi/pulumi";
import * as aws from '@pulumi/aws';
import { pubsub1id } from "./vpc";
import { SecGrup } from "./securityGroup";
import * as path from 'path';

// Get the current directory
const currentDir = __dirname;

// // Local path to the script.ps1 file
const localScriptPath = path.join(currentDir,'PULUMI-WINDOWS', 'script.ps1');

// Script to create a folder and copy script.ps1 file
const createFolderAndCopyScript = `
$folderPath = "C:\\Ansible"
if (-not (Test-Path $folderPath -PathType Container)) {
    New-Item -Path $folderPath -ItemType Directory
}

$scriptPath = "${localScriptPath}"
$destinationPath = Join-Path $folderPath "script.ps1"
Copy-Item -Path $scriptPath -Destination $destinationPath -Force
`;

// Run the PowerShell script to create the folder and copy the script file
const userData = pulumi.interpolate`<powershell>${createFolderAndCopyScript}</powershell>`;




const instance = new aws.ec2.Instance(varconfig.amzec2keyval.name, {
    ami: varconfig.amzec2keyval.amiid,  // Windows 2019 AMI
    instanceType: varconfig.amzec2keyval.instancetype,  // Choose an appropriate instance type
    subnetId: pubsub1id,
    securityGroups: [SecGrup],
    keyName: varconfig.amzec2keyval.keypairname,  // Replace with your SSH key name
    associatePublicIpAddress: true,
    userData: userData,
    tags: {
        Name: "WindowsInstanceWithScript",
    },
});

export const publicIp = instance.publicIp;
export const privateIp = instance.privateIp;
export const publicHostName = instance.publicDns;

export const instanceId = instance.id;
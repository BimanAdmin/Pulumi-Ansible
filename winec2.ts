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
const localScriptPath = "C:\\Users\\bboro\\Downloads\\script.ps1";

// Copy the script.ps1 file to the Windows EC2 instance
const copyFileScript = `
Copy-Item -Path ${localScriptPath} -Destination C:\\Ansible -Force
`;

// Run the PowerShell script to create the folder and copy the script file
const userData = pulumi.interpolate`<powershell>${createFolderScript}\n${copyFileScript}</powershell>`;


// // Create an S3 bucket
// const bucket = new aws.s3.Bucket("my-s3-bucket");

// // Upload a local file to the S3 bucket
// const object = new aws.s3.BucketObject("my-object", {
//     bucket: bucket,
//     //acl: "private", // Set the ACL as needed
//     source: new pulumi.asset.FileAsset("C:\\Users\\bboro\\Downloads\\script.ps1"),
// });



//const userData1 = pulumi.interpolate`<powershell>${createFolderScript}\n${copyFileScript}</powershell>`;

//const userData = pulumi.interpolate`<powershell>Start-Sleep -s 60; Invoke-WebRequest -Uri "${scriptObject.bucket.apply(bucket => `https://${bucket}.s3.amazonaws.com/script.ps1`)}" -OutFile C:\\Ansible\\script.ps1</powershell>`;

// // Define the PowerShell script to download the file to the EC2 instance
// const downloadFileScript = `
// aws s3 cp s3://${bucket.bucket}/${object.key} C:\\Ansible\\
// `;

// Run a PowerShell script on the EC2 instance to download the file
//const downloadFileUserData = pulumi.interpolate`<powershell>${downloadFileScript}</powershell>`;



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
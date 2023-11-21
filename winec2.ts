import * as varconfig from "./Config";
import * as pulumi from "@pulumi/pulumi";
import * as aws from '@pulumi/aws';
import { pubsub1id } from "./vpc";
import { SecGrup } from "./securityGroup";

const region = "us-west-2";

// Create a PowerShell script to be executed on the EC2 instance
const folderScript = `
Set-ExecutionPolicy -ExecutionPolicy Bypass -Force
$folderPath = "C:\\PulumiFolder"
if (!(Test-Path -Path $folderPath -PathType Container)) {
    New-Item -ItemType Directory -Path $folderPath
}
`;

// Create an S3 bucket to store the PowerShell script
const scriptBucket = new aws.s3.Bucket("script-bucket");

// Upload the script.ps1 to the S3 bucket
const scriptObject = new aws.s3.BucketObject("script.ps1", {
    bucket: scriptBucket.bucket,
    //acl: "public-read",
    source: new pulumi.asset.FileAsset("script.ps1"),
});

// Download the script.ps1 file from S3 to the EC2 instance
const downloadScript = new aws.s3.BucketObject("downloadScript.ps1", {
    bucket: scriptBucket.bucket,
    //acl: "private",
    source: scriptObject,
});

// Set up user data to download and execute the script on the EC2 instance
const userData = pulumi.interpolate`<powershell>
${folderScript}
# Download and execute the script.ps1
Invoke-WebRequest -Uri ${downloadScript.bucket.apply(bucket => `https://${bucket}.s3.${region}.amazonaws.com/${downloadScript.key}`)} -OutFile C:\\PulumiFolder\\script.ps1
# Grant read and execute permissions
icacls C:\\PulumiFolder\\script.ps1 /grant:r "Users:(R,X)"
C:\\PulumiFolder\\script.ps1
</powershell>`;



const instance = new aws.ec2.Instance(varconfig.amzec2keyval.name, {
    ami: varconfig.amzec2keyval.amiid,  // Windows 2019 AMI
    instanceType: varconfig.amzec2keyval.instancetype,  // Choose an appropriate instance type
    subnetId: pubsub1id,
    securityGroups: [SecGrup],
    keyName: varconfig.amzec2keyval.keypairname,  // Replace with your SSH key name
    associatePublicIpAddress: true,
    userData: userData,
    tags: {
        Name: "Windows-server",
    },
});

export const publicIp = instance.publicIp;
export const privateIp = instance.privateIp;
export const publicHostName = instance.publicDns;

export const instanceId = instance.id;
export const scriptUrl = downloadScript.bucket.apply(bucket => `https://${bucket}.s3.${region}.amazonaws.com/${downloadScript.key}`);
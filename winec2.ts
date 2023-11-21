import * as varconfig from "./Config";
import * as pulumi from "@pulumi/pulumi";
import * as aws from '@pulumi/aws';
import { pubsub1id, pubsub2id, vpcId  } from "./vpc";
import { SecGrup } from "./securityGroup";


const instance = new aws.ec2.Instance(varconfig.amzec2keyval.name, {
    ami: varconfig.amzec2keyval.amiid,  // Windows 2019 AMI
    instanceType: varconfig.amzec2keyval.instancetype,  // Choose an appropriate instance type
    subnetId: pubsub1id,
    securityGroups: [SecGrup],
    keyName: varconfig.amzec2keyval.keypairname,  // Replace with your SSH key name
    associatePublicIpAddress: true,
    tags: {
        Name: "WindowsInstanceWithScript",
    },

    userData: pulumi.interpolate`<powershell>
# Install IIS Web Server
Install-WindowsFeature -Name Web-Server -IncludeManagementTools

# Create a custom HTML file
@"
<!DOCTYPE html>
<html>
<head>
    <title>My Custom Page</title>
</head>
<body>
    <h1>Hello from Pulumi and IIS!</h1>
</body>
</html>
"@ | Out-File -FilePath "C:\\inetpub\\wwwroot\\index.html" -Encoding utf8

</powershell>`,
});

// Create an ALB to balance traffic to the instances
const alb = new aws.lb.LoadBalancer("my-alb", {
    internal: false,
    loadBalancerType: "application",
    securityGroups: [SecGrup], // Specify your ALB security group ID
    subnets: [pubsub1id, pubsub2id],
});

// Create a target group for the ALB
const targetGroup = new aws.lb.TargetGroup("my-target-group", {
    port: 80,
    protocol: "HTTP",
    vpcId: vpcId, // Specify your VPC ID
    targetType: "instance",
});

// Attach the EC2 instance to the target group
const targetGroupAttachment = new aws.lb.TargetGroupAttachment("my-target-group-attachment", {
    targetGroupArn: targetGroup.arn,
    targetId: instance.id,
    port: 80,
});

// // Create an ALB listener
// const listener = new aws.lb.Listener("my-listener", {
//     loadBalancerArn: alb.arn,
//     port: 80,
//     defaultActions: [
//         {
//             type: "fixed-response",
//             fixedResponse: {
//                 contentType: "text/plain",
//                 statusCode: "200",
//                 messageBody: "Hello from ALB!",
//             },
//         },

//     ],
// });

// Create an ALB listener for forwarding to the target group
const targetGroupListener = new aws.lb.Listener("my-target-group-listener", {
    loadBalancerArn: alb.arn,
    port: 80,
    defaultActions: [
        {
            type: "forward",
            targetGroupArn: targetGroup.arn,
        },
    ],
});

export const publicIp = instance.publicIp;
export const privateIp = instance.privateIp;
//export const publicHostName = instance.publicDns;
export const publicHostName = alb.dnsName; // Use the ALB DNS name to access the application
export const instanceId = instance.id;
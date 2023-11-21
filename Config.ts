///////////
//AWS Region
export const awsregion = "us-west-2";

//AWS AccountID
//export const awsaccountid = "193088938549";

//VPC CIDR
export const vpcCidrBlock = "173.0.0.0/16";

//VPCTags
export const vpcTags = {
    Name: "my-vpc-02",
    Env: "sandbox-biman",
};

export const igwTags = {
    Name: vpcTags.Name +"-igw",
    Env: "sandbox-biman"
}

export const pubsub1 = {
    sub1cidrblock: "173.0.1.0/24",
    Name: vpcTags.Name +"-PublicSub-1",
    Env: vpcTags.Env
}

export const pubsub2 = {
    sub1cidrblock: "173.0.2.0/24",
    Name: vpcTags.Name +"-PublicSub-2",
    Env: vpcTags.Env
}

export const prisub1 = {
    sub1cidrblock: "173.0.3.0/24",
    Name: vpcTags.Name +"-PrivateSub-1",
    Env: vpcTags.Env
}

export const prisub2 = {
    sub1cidrblock: "173.0.4.0/24",
    Name: vpcTags.Name +"-PrivateSub-2",
    Env: vpcTags.Env
}

export const natGateway = {
    Name: vpcTags.Name +"-ngw",
    Env: vpcTags.Env
}

//Security SG
export const securitygroup = {
    description: "EC2 security group ",
    name: vpcTags.Name +" SG"
}

//sqlserver password
export const sqlsvrPassword = "W#RY7YJSkT9nwsF&19tSWS";


//EC2 Variablles values 

export const amzec2keyval = {
    keypairname: "KC-UAT-US",
    instancetype: "t3a.medium",
    garminstancetype: "t4g.small",
    name: "windows-server",
    garmname: "sb-zbx-gec2",
    privateip: "172.20.3.114",
    amiid: "ami-02b43d6c625775ddb"//Microsoft Windows Server 2019 with Desktop
}

// Define your EKS local variables
export const eksvarconfigval = {
    clsname: vpcTags.Name +"-ekscls",
    nodeGroupOnename: "eksnodegpone",
    ec2amitype:"AL2_X86_64",
    fixnggrpinstype: "t3a.medium",
    fixnggrpinstype2: "t3.medium",
    spotnggrpinstype: "t3a.medium",
    eksclsversion: "1.27",
}

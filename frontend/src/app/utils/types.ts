export interface BlogCardProps {
    id: string;
    title: string;
    content: string;
    imageURL : string;
    createdAt: string;
}

export interface BlogData {
  title: string
  content: string
  createdAt: string
  imageURL : string
  citations : string[]
}
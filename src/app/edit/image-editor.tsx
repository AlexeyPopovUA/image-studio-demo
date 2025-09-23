"use client";

import {useSearchParams} from "next/navigation";

export function ImageEditor () {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  {/* Image Editor */}
  return <div>{id}</div>
}

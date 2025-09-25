import Link from "next/link";

export function ResetHelper() {
  return (
    <>
      Try navigating to a different page or{" "}
      <Link href="/" className="text-primary underline underline-offset-4" shallow>
        reset to the first page
      </Link>
    </>
  )
}
